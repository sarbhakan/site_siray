// Verify value preservation, photo controls and the native field-preview bridge
// without a browser or credentials. Real Sveltia upload/save is an integration check.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const repo = path.resolve(__dirname, '../..');
const widgets = {};
let activeHooks = null;
const React = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }),
  useState: initial => activeHooks ? activeHooks.useState(initial) : [initial, () => {}],
  useEffect: (effect,deps) => activeHooks?.useEffect(effect,deps),
  useRef: initial => activeHooks ? activeHooks.useRef(initial) : ({current:initial}),
  useImperativeHandle: (ref, get) => { if (ref) ref.current = get(); }, forwardRef: component => component,
};
const windowListeners = new Map();
const sandbox = { globalThis: {
  addEventListener(type, listener) {
    if (!windowListeners.has(type)) windowListeners.set(type, new Set());
    windowListeners.get(type).add(listener);
  },
  removeEventListener(type, listener) { windowListeners.get(type)?.delete(listener); },
}, Intl, Object, Array, Number, String, Error };
vm.runInNewContext(fs.readFileSync(`${repo}/public/admin/photo-gallery.js`, 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(`${repo}/public/admin/studio-widgets.js`, 'utf8'), sandbox);
const api = sandbox.globalThis.SirayStudioWidgets;
// Sveltia renders field previews directly when no collection template or custom
// preview stylesheet is registered. This must also work without either API.
api.init({ React, registerFieldType: def => widgets[def.name] = def });
let checks = 0;
const test = (message, fn) => { try { fn(); checks++; } catch (error) { error.message = `${message}: ${error.message}`; throw error; } };
const h = api.helpers;
for (const [input, want] of [['50% 65.789%', [50, 65.789]], ['0% 100%', [0, 100]], ['999% 0%', [100, 0]], ['left top', [50, 50]], ['', [50, 50]], [null, [50, 50]]]) {
  test(`position ${input}`, () => assert.equal(JSON.stringify(h.parsePosition(input)), JSON.stringify(want)));
}
for (const bad of ['javascript:alert(1)', 'data:image/svg+xml,foo', '//evil.example/a', '/\\evil.example/a', 'https://example.com/\na', 'https://example.com/ a']) {
  test('URL refused', () => assert.equal(h.safeImageURL(bad), ''));
}
for (const good of ['/images/a.webp', 'blob:https://siraysignature.fr/id', 'https://example.com/a.jpg']) {
  test('URL accepted', () => assert.equal(h.safeImageURL(good), good));
}
test('Resolved asset URL', () => assert.equal(h.safeImageURL('/src/assets/uploads/a.webp', () => ({ url: 'blob:https://site.test/id' })), 'blob:https://site.test/id'));
test('Position precision', () => assert.equal(h.positionString(23, 65.789), '23% 65.789%'));
const field = { get: key => ({ photo_context: 'cover', show_gallery_fields: false })[key] };
const content = name => JSON.parse(fs.readFileSync(`${repo}/src/content/${name}.json`));
const data = content('photography');
const photos = [...data.homeSlides, ...Object.values(data.homePhotos), ...data.collections.flatMap(p => [p.cover, p.detail, p.request, p.home]), ...data.gallery];
function nodes(root) { return !root || typeof root !== 'object' ? [] : Array.isArray(root) ? root.flatMap(nodes) : [root, ...(root.children || []).flatMap(nodes)]; }
function render(node) {
  if (Array.isArray(node)) return node.map(render).flat(Infinity);
  if (!node || typeof node !== 'object') return node;
  if (typeof node.type === 'function') return render(node.type({ ...node.props, children: node.children }));
  return { ...node, children: node.children.map(render).flat(Infinity) };
}
function strings(node) { if (Array.isArray(node)) return node.map(strings).join(' '); if (typeof node === 'string') return node; return !node || typeof node !== 'object' ? '' : (node.children || []).map(strings).join(' '); }
// Small hook runner for the crop transaction. It exercises actual component
// handlers across rerenders; native dialog focus containment is a browser check.
function hookRunner(component, initialProps, attachRef = () => null) {
  const slots = [];
  let props = initialProps, tree, dirty = false;
  const render = nextProps => {
    if (nextProps) props = nextProps;
    const original = activeHooks;
    let passes = 0;
    try {
      do {
        if (++passes > 12) throw Error('Hook runner did not settle');
        dirty = false;
        let index = 0;
        const pending = [];
        const useState = initial => {
          const i = index++;
          if (!slots[i]) slots[i] = {value:typeof initial==='function'?initial():initial};
          return [slots[i].value, next => {
            const value = typeof next==='function'?next(slots[i].value):next;
            if (!Object.is(value,slots[i].value)) {slots[i].value=value;dirty=true;}
          }];
        };
        const useRef = initial => {
          const i = index++;
          if (!slots[i]) slots[i] = {value:{current:initial}};
          return slots[i].value;
        };
        const useEffect = (effect,deps) => {
          const i = index++, old = slots[i];
          if (!old || !deps || !old.deps || deps.some((value,j)=>!Object.is(value,old.deps[j]))) {
            pending.push(()=>{old?.cleanup?.();slots[i]={deps,cleanup:effect()};});
          }
        };
        activeHooks = {useState,useRef,useEffect};
        tree = component(props,{});
        for (const node of nodes(tree)) if (typeof node.type==='string' && node.props.ref) {
          node.props.ref.current = attachRef(node);
        }
        for (const effect of pending) effect();
      } while(dirty);
    } finally {activeHooks=original;}
    return tree;
  };
  return {render,get tree(){return tree;},unmount(){for(const slot of slots)slot?.cleanup?.();}};
}
const getAsset = path => ({ url: path });
for (const photo of photos) test('Existing photo shape untouched', () => {
  const before = JSON.stringify(photo), ref = {};
  widgets['siray-photo'].controlComponent({ value: photo, field, forID: 'photo', getAsset,
    pickFile: () => null, onChange: () => { throw Error('render changed data'); } }, ref);
  assert.equal(JSON.stringify(photo), before); assert.equal(ref.current.isValid(), true);
});
for (const photo of photos) test('Native photo preview renders the existing object', () => {
  const before = JSON.stringify(photo);
  const output = render(widgets['siray-photo'].previewComponent({ value: photo, field, getAsset }));
  const images = nodes(output).filter(node => node.type === 'img');
  assert.equal(images.length, 1);
  assert.equal(images[0].props.src, photo.file);
  assert.equal(images[0].props.alt, photo.alt);
  assert.equal(images[0].props.style.objectPosition, photo.position || '50% 50%');
  assert.equal(nodes(output).filter(node => node.type === 'iframe').length, 0);
  if (photo.label) assert.ok(strings(output).includes(photo.label));
  assert.equal(JSON.stringify(photo), before);
});
(async () => {
  const value = { file: '/images/original.webp', alt: 'Gâteau ivoire', position: '50% 65.789%', retained: 'preserved' }; let next;
  let pickerOptions;
  const control = widgets['siray-photo'].controlComponent({ value, field, forID: 'photo', getAsset,
    pickFile: async options => { pickerOptions = options; return { value: 'blob:https://site.test/new', file: {} }; }, onChange: updated => next = updated }, {});
  test('Horizontal crop preserves vertical precision', () => {
    nodes(control).find(n => n.props.id === 'photo-x').props.onChange({ target: { value: '23' } });
    assert.equal(next.position, '23% 65.789%'); assert.equal(next.file, value.file); assert.equal(next.retained, 'preserved');
  });
  await nodes(control).find(n => n.props.id === 'photo').props.onClick();
  test('A chosen upload awaits gallery metadata without replacing the live image', () => {
    assert.equal(next.file, value.file); assert.equal(next.alt, value.alt); assert.equal(next.position, '23% 65.789%'); assert.equal(next.retained, 'preserved');
  });
  test('Picker keeps the official single-image pipeline and refuses arbitrary URL entry', () => {
    assert.equal(pickerOptions.kind, 'image'); assert.equal(pickerOptions.multiple, false); assert.equal(pickerOptions.allowURL, false);
  });
  test('Crop controls expose keyboard-compatible ranges', () => {
    for (const axis of ['x', 'y']) {
      const input = nodes(control).find(n => n.props.id === `photo-${axis}`);
      assert.equal(input.type, 'input'); assert.equal(input.props.type, 'range');
      assert.equal(input.props.min, 0); assert.equal(input.props.max, 100);
      assert.equal(input.props.step, 1); assert.ok(input.props['aria-valuetext'].includes('pour cent'));
    }
  });
  test('Every range reacts to input before release, even before the CMS sends new props', () => {
    nodes(control).find(n => n.props.id === 'photo-y').props.onInput({ currentTarget: { value: '73' } });
    assert.equal(next.position, '23% 73%');
    nodes(control).find(n => n.props.id === 'photo-zoom').props.onInput({ currentTarget: { value: '1.4' } });
    assert.equal(next.zoom, 1.4); assert.equal(next.position, '23% 73%');
    assert.equal(next.retained, 'preserved');
  });
  test('Reset removes zoom and restores both axes together', () => {
    nodes(control).find(n => n.type === 'button' && strings(n) === 'Réinitialiser le cadrage').props.onClick();
    assert.equal(next.position, '50% 50%'); assert.equal(next.zoom, 1);
    assert.equal(next.retained, 'preserved');
  });
  test('Preview renders the same optional magnification as the public site', () => {
    const preview = render(widgets['siray-photo'].previewComponent({ value: {...value,zoom:1.4}, field, getAsset }));
    const image = nodes(preview).find(n => n.type === 'img');
    // React 18 appends px to an unknown numeric CSS property; scale must be a string.
    assert.equal(image.props.style.scale, '1.4');
    assert.equal(image.props.style.transformOrigin, value.position);
  });
  test('An exact-ratio original has no movable axis until zoomed', () => {
    const full = h.cropWindow(1200,1600,3/4);
    assert.equal(full.width, 100); assert.equal(full.height, 100);
    assert.equal(full.horizontal, false); assert.equal(full.vertical, false);
    const close = h.cropWindow(1200,1600,3/4,'50% 50%',1.5);
    assert.ok(close.horizontal && close.vertical);
    assert.ok(Math.abs(close.width - 100/1.5) < .000001);
    assert.ok(Math.abs(close.left - (100-close.width)/2) < .000001);
  });
  test('Crop rectangle reaches both edges and never leaves the original', () => {
    for (const [w,hh] of [[1200,1600],[1320,2346],[2400,1000]]) for (const ratio of [3/4,4/5,4/3,1,16/9]) {
      for (const zoom of [1,1.5,2]) for (const position of ['0% 0%','50% 50%','100% 100%']) {
        const rect=h.cropWindow(w,hh,ratio,position,zoom);
        assert.ok(rect.left >= 0 && rect.top >= 0);
        assert.ok(rect.left + rect.width <= 100.00001 && rect.top + rect.height <= 100.00001);
        assert.ok(Math.abs((w*rect.width)/(hh*rect.height)-ratio) < .000001);
        if(position==='100% 100%') {
          assert.ok(Math.abs(rect.left+rect.width-100) < .000001);
          assert.ok(Math.abs(rect.top+rect.height-100) < .000001);
        }
      }
    }
    assert.equal(h.cropWindow(0,100,1), null);
    assert.equal(h.cropWindow(10,100,Infinity), null);
  });
  test('Finger displacement maps to actual rendered pixels, including zoom and transform origin', () => {
    assert.equal(h.dragPosition(1200,1600,150,200,'50% 50%',1.5,15,-20), '30% 70%');
    // Independently reconstruct the CSS content offset after object-fit and
    // scale about the same percentage origin. Avoid merely restating the helper.
    for (const [sourceW,sourceH] of [[1200,1600],[2400,1000],[1320,2346]]) {
      for (const [frameW,frameH] of [[150,200],[300,170],[190,190]]) for (const zoom of [1,1.3,2]) {
        const fit = Math.max(frameW/sourceW,frameH/sourceH);
        const overflow = [sourceW*fit*zoom-frameW,sourceH*fit*zoom-frameH];
        const deltas = overflow.map(n => n*.1);
        const result = h.parsePosition(h.dragPosition(sourceW,sourceH,frameW,frameH,'45% 60%',zoom,...deltas));
        for (let axis=0;axis<2;axis++) {
          const start = [45,60][axis], amount = overflow[axis];
          if (amount < .001) assert.equal(result[axis], start);
          else assert.ok(Math.abs((start-result[axis])*amount/100-deltas[axis]) < .00001);
        }
      }
    }
  });
  test('Dragging clamps both edges and leaves fitted axes unchanged', () => {
    assert.equal(h.dragPosition(1200,1600,150,200,'50% 50%',1.5,1000,-1000), '0% 100%');
    assert.equal(h.dragPosition(1200,1600,150,200,'23% 71%',1,40,-40), '23% 71%');
    assert.equal(h.dragPosition(1200,1600,160,200,'50% 50%',1,30,10/3), '50% 25%');
    assert.equal(h.dragPosition(2400,1000,200,200,'50% 50%',1,28,100), '40% 50%');
    for (const dims of [[0,1600,150,200],[1200,NaN,150,200],[1200,1600,0,200],[1200,1600,150,Infinity]]) {
      assert.equal(h.dragPosition(...dims,'30% 60%',1.5,10,10), '30% 60%');
    }
    assert.equal(h.dragPosition(1200,1600,150,200,'30% 60%',1.5,NaN,10), '30% 60%');
  });
  test('Pinch keeps the point under the fingers while scaling, and follows their midpoint', () => {
    const frame={width:1200,height:1600,frameWidth:150,frameHeight:200,zoom:1,position:'50% 50%'};
    const fixed=h.pinchCrop(frame,{x:37.5,y:50,distance:50},{x:37.5,y:50,distance:100});
    assert.equal(fixed.zoom,2);assert.equal(fixed.position,'25% 25%');
    const center=h.pinchCrop(frame,{x:75,y:100,distance:50},{x:75,y:100,distance:100});
    assert.equal(center.position,'50% 50%');
    const translated=h.pinchCrop({...frame,zoom:1.5},{x:75,y:100,distance:50},{x:90,y:80,distance:50});
    assert.equal(translated.zoom,1.5);assert.equal(translated.position,'30% 70%');
    for (const [width,height] of [[1200,1600],[2400,1000],[1320,2346]]) for (const [fw,fh] of [[150,200],[300,170],[190,190]]) {
      const f={width,height,frameWidth:fw,frameHeight:fh,zoom:1.3,position:'50% 50%'};
      const from={x:fw*.48,y:fh*.48,distance:60},to={x:fw*.53,y:fh*.52,distance:75};
      const crop=h.pinchCrop(f,from,to),percent=h.parsePosition(crop.position);
      const fit=Math.max(fw/width,fh/height),before=[width*fit*f.zoom,height*fit*f.zoom],after=[width*fit*crop.zoom,height*fit*crop.zoom];
      for(let axis=0;axis<2;axis++) {
        const extent=[fw,fh][axis],start=[from.x,from.y][axis],end=[to.x,to.y][axis];
        const originalPoint=(start-(extent-before[axis])*.5)/before[axis];
        const renderedPoint=(end-(extent-after[axis])*percent[axis]/100)/after[axis];
        assert.ok(Math.abs(originalPoint-renderedPoint)<.00001);
      }
    }
  });
  test('Pinch zoom and crop stay bounded and reject unusable geometry without writing NaN', () => {
    const f={width:1200,height:1600,frameWidth:150,frameHeight:200,zoom:1.5,position:'30% 60%'};
    const at={x:75,y:100,distance:50};
    assert.equal(h.pinchCrop(f,at,{...at,distance:500}).zoom,2);
    assert.equal(h.pinchCrop(f,at,{...at,distance:1}).zoom,1);
    const edge=h.pinchCrop(f,at,{x:10000,y:-10000,distance:60});
    assert.equal(edge.position,'0% 100%');
    for(const [frame,from,to] of [
      [{...f,width:0},at,at],[{...f,height:NaN},at,at],[{...f,frameWidth:Infinity},at,at],
      [f,{...at,distance:0},at],[f,at,{...at,distance:-1}],[f,at,{...at,x:NaN}],
      [f,{...at,y:Infinity},at],[f,at,{...at,distance:Infinity}],
    ]) {
      const result=h.pinchCrop(frame,from,to);
      assert.equal(result.zoom,1.5);assert.equal(result.position,'30% 60%');
    }
    const min=h.pinchCrop({...f,zoom:1,position:'23% 71%'},at,{...at,distance:25});
    assert.equal(min.zoom,1);assert.equal(min.position,'23% 71%');
  });
  function dragRig(overrides = {}, geometry = {}) {
    const value = {file:'/images/drag.webp',alt:'Un layer cake',position:'50% 50%',zoom:1.5,
      label:'Une légende',category:'layer-cakes',retained:'preserved',...overrides};
    const changes=[],captured=new Set(),releases=[];
    let prevented=0;
    const target = {
      querySelector: () => ({naturalWidth:1200,naturalHeight:1600,...geometry.image}),
      getBoundingClientRect: () => ({left:0,top:0,width:150,height:200,...geometry.frame}),
      setPointerCapture: id => captured.add(id),
      hasPointerCapture: id => captured.has(id),
      releasePointerCapture: id => {captured.delete(id);releases.push(id);},
    };
    const control = widgets['siray-photo'].controlComponent({value,field,forID:'drag',getAsset,
      pickFile:async()=>({value:'blob:https://site.test/replacement'}),
      onChange: next => changes.push(next)},{});
    const frame=nodes(control).find(n => n.props.onPointerDown);
    const event = patch => ({currentTarget:target,pointerId:7,isPrimary:true,pointerType:'touch',button:0,
      clientX:80,clientY:90,preventDefault:()=>prevented++,...patch});
    return {value,changes,captured,releases,target,control,frame,event,get prevented(){return prevented;}};
  }
  test('Dragging updates immediately before CMS props, without accumulating deltas or changing metadata', () => {
    const rig=dragRig(),before=JSON.stringify(rig.value);
    rig.frame.props.onPointerDown(rig.event());
    assert.ok(rig.captured.has(7));
    rig.frame.props.onPointerMove(rig.event({clientX:95,clientY:70}));
    assert.equal(rig.changes.at(-1).position,'30% 70%');
    rig.frame.props.onPointerMove(rig.event({clientX:102.5,clientY:80}));
    assert.equal(rig.changes.at(-1).position,'20% 60%');
    for (const key of ['file','alt','zoom','label','category','retained']) {
      assert.equal(rig.changes.at(-1)[key],rig.value[key]);
    }
    assert.equal(JSON.stringify(rig.value),before);
    assert.equal(rig.prevented,3);
    rig.frame.props.onPointerUp(rig.event());
    assert.deepEqual(rig.releases,[7]);
    const count=rig.changes.length;
    rig.frame.props.onPointerMove(rig.event({clientX:0}));
    assert.equal(rig.changes.length,count);
    // A new drag starts from the most recent local crop, even without new props.
    rig.frame.props.onPointerDown(rig.event());
    rig.frame.props.onPointerMove(rig.event({clientX:87.5,clientY:100}));
    assert.equal(rig.changes.at(-1).position,'10% 50%');
    rig.frame.props.onPointerUp(rig.event());
  });
  test('Only a second touch joins; unknown pointers and extra fingers cannot alter the gesture', () => {
    const rig=dragRig();
    rig.frame.props.onPointerDown(rig.event());
    rig.frame.props.onPointerDown(rig.event({pointerId:9,isPrimary:false,clientX:120}));
    assert.equal(rig.captured.size,2);
    const count=rig.changes.length;
    rig.frame.props.onPointerDown(rig.event({pointerId:11,isPrimary:false,clientX:500}));
    rig.frame.props.onPointerMove(rig.event({pointerId:11,clientX:1000}));
    rig.frame.props.onPointerUp(rig.event({pointerId:11}));
    assert.equal(rig.changes.length,count);assert.equal(rig.captured.size,2);
    rig.frame.props.onPointerUp(rig.event({pointerId:9}));
    assert.ok(rig.captured.has(7));
    rig.frame.props.onPointerMove(rig.event({clientX:95,clientY:70}));
    assert.equal(rig.changes.at(-1).position,'30% 70%');
    rig.frame.props.onPointerUp(rig.event());
    assert.deepEqual(rig.releases,[9,7]);
  });
  function startPinch(rig,first={x:50,y:100},second={x:100,y:100}) {
    rig.frame.props.onPointerDown(rig.event({clientX:first.x,clientY:first.y}));
    rig.frame.props.onPointerDown(rig.event({pointerId:9,isPrimary:false,clientX:second.x,clientY:second.y}));
  }
  test('One to two to one fingers rebase smoothly and update zoom and position atomically', () => {
    const rig=dragRig({zoom:1}),before=JSON.stringify(rig.value);
    startPinch(rig);
    assert.equal(rig.changes.length,0);assert.equal(rig.captured.size,2);
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:125,clientY:100}));
    const pinched=rig.changes.at(-1);
    assert.equal(pinched.zoom,1.5);assert.equal(pinched.position,'33.333% 50%');
    for(const key of ['file','alt','label','category','retained']) assert.equal(pinched[key],rig.value[key]);
    assert.equal(JSON.stringify(rig.value),before);assert.equal(rig.changes.length,1);
    rig.frame.props.onPointerUp(rig.event({pointerId:9}));
    const count=rig.changes.length;
    rig.frame.props.onPointerMove(rig.event({clientX:50,clientY:100}));
    assert.equal(rig.changes.length,count);
    rig.frame.props.onPointerMove(rig.event({clientX:57.5,clientY:110}));
    assert.equal(rig.changes.at(-1).zoom,1.5);assert.equal(rig.changes.at(-1).position,'23.333% 40%');
    rig.frame.props.onPointerUp(rig.event());assert.equal(rig.captured.size,0);
  });
  test('Pinch midpoint uses coordinates local to the photograph', () => {
    const rig=dragRig({zoom:1},{frame:{left:100,top:200}});
    startPinch(rig,{x:125,y:250},{x:150,y:250});
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:175,clientY:250}));
    assert.equal(rig.changes.at(-1).zoom,2);
    assert.equal(rig.changes.at(-1).position,'16.667% 25%');
    rig.frame.props.onPointerUp(rig.event({pointerId:9}));rig.frame.props.onPointerUp(rig.event());
  });
  test('Lifting the original primary finger leaves the other able to pan and accept a new pinch', () => {
    const rig=dragRig();startPinch(rig);
    rig.frame.props.onPointerUp(rig.event());assert.ok(rig.captured.has(9));
    rig.frame.props.onPointerMove(rig.event({pointerId:9,isPrimary:false,clientX:107.5,clientY:110}));
    assert.equal(rig.changes.at(-1).position,'40% 40%');
    rig.frame.props.onPointerDown(rig.event({pointerId:11,isPrimary:false,clientX:130,clientY:110}));
    assert.equal(rig.captured.size,2);
    rig.frame.props.onPointerMove(rig.event({pointerId:11,isPrimary:false,clientX:135,clientY:110}));
    assert.ok(rig.changes.at(-1).zoom>1.5);
    rig.frame.props.onPointerCancel(rig.event({pointerId:9}));assert.equal(rig.captured.size,0);
  });
  test('Reversing from either zoom limit responds on the very next movement', () => {
    const rig=dragRig({zoom:1});startPinch(rig);
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:200,clientY:100}));
    assert.equal(rig.changes.at(-1).zoom,2);
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:190,clientY:100}));
    assert.ok(rig.changes.at(-1).zoom<2);
    assert.ok(Math.abs(rig.changes.at(-1).zoom-2*140/150)<.0001);
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:70,clientY:100}));
    assert.equal(rig.changes.at(-1).zoom,1);
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:75,clientY:100}));
    assert.equal(rig.changes.at(-1).zoom,1.25);
    rig.frame.props.onPointerUp(rig.event({pointerId:9}));rig.frame.props.onPointerUp(rig.event());
  });
  test('Coincident fingers wait for a usable distance without NaN or a sudden scale jump', () => {
    const rig=dragRig({zoom:1});startPinch(rig,{x:75,y:100},{x:75,y:100});
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:76,clientY:100}));assert.equal(rig.changes.length,0);
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:85,clientY:100}));assert.equal(rig.changes.length,0);
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:90,clientY:100}));
    assert.equal(rig.changes.at(-1).zoom,1.5);
    rig.frame.props.onPointerCancel(rig.event());assert.equal(rig.captured.size,0);
  });
  test('Mouse and pen cannot join a pinch, and a touch cannot join an active mouse drag', () => {
    for(const type of ['mouse','pen']) {
      const rig=dragRig();rig.frame.props.onPointerDown(rig.event());
      rig.frame.props.onPointerDown(rig.event({pointerType:type,pointerId:9,isPrimary:true}));
      assert.equal(rig.captured.size,1);rig.frame.props.onPointerUp(rig.event());
    }
    const rig=dragRig();rig.frame.props.onPointerDown(rig.event({pointerType:'mouse'}));
    rig.frame.props.onPointerDown(rig.event({pointerId:9,isPrimary:false}));assert.equal(rig.captured.size,1);
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:500}));assert.equal(rig.changes.length,0);
    rig.frame.props.onPointerUp(rig.event());
  });
  test('Cancel or lost capture of either finger terminates the entire pinch safely', () => {
    for(const finish of ['onPointerCancel','onLostPointerCapture']) for(const pointerId of [7,9]) {
      const rig=dragRig();startPinch(rig);
      rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:110,clientY:100}));
      const count=rig.changes.length;
      if(finish==='onLostPointerCapture') rig.captured.delete(pointerId);
      rig.frame.props[finish](rig.event({pointerId}));assert.equal(rig.captured.size,0);
      rig.frame.props.onPointerMove(rig.event({clientX:0}));rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:200}));
      assert.equal(rig.changes.length,count);
    }
  });
  test('Sliders, reset, image mode and format choices cancel both captured fingers', () => {
    for(const action of ['zoom','x','y','reset','whole','format']) {
      const rig=dragRig();startPinch(rig);
      if(['zoom','x','y'].includes(action)) nodes(rig.control).find(n=>n.props.id==='drag-'+action).props.onInput({currentTarget:{value:action==='zoom'?'1.7':'40'}});
      else nodes(rig.control).find(n=>n.type==='button'&&strings(n)===({reset:'Réinitialiser le cadrage',whole:'Image entière',format:'Liste des prestations'})[action]).props.onClick();
      assert.equal(rig.captured.size,0);
      const count=rig.changes.length;
      rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:200}));assert.equal(rig.changes.length,count);
    }
  });
  test('Nonprimary touch and secondary mouse presses leave page gestures untouched', () => {
    for (const patch of [{isPrimary:false},{pointerType:'mouse',button:2}]) {
      const rig=dragRig();
      rig.frame.props.onPointerDown(rig.event(patch));
      rig.frame.props.onPointerMove(rig.event({clientX:100}));
      assert.equal(rig.changes.length,0);assert.equal(rig.captured.size,0);assert.equal(rig.prevented,0);
    }
  });
  test('Pointer cancellation and capture loss stop changes and release safely', () => {
    for (const finish of ['onPointerCancel','onLostPointerCapture']) {
      const rig=dragRig();rig.frame.props.onPointerDown(rig.event());
      rig.frame.props.onPointerMove(rig.event({clientX:95,clientY:70}));
      if (finish==='onLostPointerCapture') rig.captured.delete(7);
      rig.frame.props[finish](rig.event());
      const count=rig.changes.length;
      rig.frame.props.onPointerMove(rig.event({clientX:110,clientY:50}));
      rig.frame.props.onPointerUp(rig.event());
      assert.equal(rig.changes.length,count);assert.equal(rig.captured.size,0);
      assert.equal(rig.changes.at(-1).position,'30% 70%');
      assert.deepEqual(rig.releases,finish==='onPointerCancel'?[7]:[]);
    }
  });
  test('A fully fitted photo captures touch for pinch, while unloaded photos and fitted mouse keep native scrolling', () => {
    const fitted=dragRig({zoom:1});
    fitted.frame.props.onPointerDown(fitted.event());
    assert.ok(fitted.captured.has(7));assert.equal(fitted.prevented,1);
    fitted.frame.props.onPointerMove(fitted.event({clientX:100}));
    assert.equal(fitted.changes.length,0);
    fitted.frame.props.onPointerUp(fitted.event());
    for (const [rig,patch] of [[dragRig({zoom:1}),{pointerType:'mouse'}],[dragRig({}, {image:{naturalWidth:0}}),{}],[dragRig({}, {frame:{width:0}}),{}]]) {
      rig.frame.props.onPointerDown(rig.event(patch));
      rig.frame.props.onPointerMove(rig.event({clientX:100}));
      assert.equal(rig.captured.size,0);assert.equal(rig.prevented,0);assert.equal(rig.changes.length,0);
    }
  });
  test('Unavailable pointer capture does not leave a stuck gesture', () => {
    const rig=dragRig();rig.target.setPointerCapture=()=>{throw Error('not active');};
    rig.frame.props.onPointerDown(rig.event());
    rig.frame.props.onPointerMove(rig.event({clientX:100}));
    assert.equal(rig.changes.length,0);assert.equal(rig.prevented,0);
  });
  test('Changing zoom or resetting stops a gesture before it can write stale coordinates', () => {
    for (const action of ['zoom','reset']) {
      const rig=dragRig();rig.frame.props.onPointerDown(rig.event());
      if (action==='zoom') nodes(rig.control).find(n=>n.props.id==='drag-zoom').props.onInput({currentTarget:{value:'1.8'}});
      else {
        nodes(rig.control).find(n=>n.type==='button'&&strings(n)==='Réinitialiser le cadrage').props.onClick();
      }
      const count=rig.changes.length;
      rig.frame.props.onPointerMove(rig.event({clientX:100}));
      assert.equal(rig.changes.length,count);assert.equal(rig.captured.size,0);
    }
  });
  test('Failed capture of the second finger leaves the original gesture usable', () => {
    const rig=dragRig();rig.frame.props.onPointerDown(rig.event());
    rig.target.setPointerCapture=()=>{throw Error('not active');};
    rig.frame.props.onPointerDown(rig.event({pointerId:9,isPrimary:false,clientX:120}));
    assert.equal(rig.captured.size,1);
    rig.frame.props.onPointerMove(rig.event({clientX:95,clientY:70}));
    assert.equal(rig.changes.at(-1).position,'30% 70%');
    rig.frame.props.onPointerUp(rig.event());assert.equal(rig.captured.size,0);
  });
  const replacedDuringPinch=dragRig();startPinch(replacedDuringPinch);
  await nodes(replacedDuringPinch.control).find(n=>n.props.id==='drag').props.onClick();
  test('Choosing a source cancels both fingers while awaiting photo metadata', () => {
    const rig=replacedDuringPinch,count=rig.changes.length;
    assert.equal(rig.captured.size,0);assert.equal(rig.changes.at(-1)?.file||rig.value.file,rig.value.file);
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:200}));assert.equal(rig.changes.length,count);
  });
  const replacedDuringDrag=dragRig();
  replacedDuringDrag.frame.props.onPointerDown(replacedDuringDrag.event());
  await nodes(replacedDuringDrag.control).find(n=>n.props.id==='drag').props.onClick();
  test('Choosing a source during a drag cannot overwrite its crop from stale dimensions', () => {
    const rig=replacedDuringDrag,count=rig.changes.length;
    assert.equal(rig.changes.at(-1)?.file||rig.value.file,rig.value.file);
    rig.frame.props.onPointerMove(rig.event({clientX:100}));
    assert.equal(rig.changes.length,count);assert.equal(rig.captured.size,0);
  });
  test('Preview disables native image dragging while keeping crop controls as an alternative', () => {
    const rig=dragRig();
    rig.frame.props.onDragStart(rig.event());assert.equal(rig.prevented,1);
    const image=nodes(render(rig.frame)).find(n=>n.type==='img');
    assert.equal(image.props.draggable,false);
    assert.ok(strings(rig.control).includes('Deux doigts pour zoomer ou dézoomer.'));
    assert.ok(nodes(rig.control).filter(n=>n.type==='input'&&n.props.type==='range').length===3);
  });
  for (const value of [{ file: '/images/photo.webp', alt: '' }, { file: '', alt: 'Photo' }]) test('Missing photo/alt rejected', () => {
    const ref = {}; widgets['siray-photo'].controlComponent({ value, field, forID: 'invalid', getAsset, onChange: () => {} }, ref); assert.notEqual(ref.current.isValid(), true);
  });
  const galleryField = { get: key => ({ photo_context: 'gallery', show_gallery_fields: true })[key] };
  for (const value of [
    { file: '/images/photo.webp', alt: 'Photo', label: '', category: 'layer-cakes' },
    { file: '/images/photo.webp', alt: 'Photo', label: 'Gâteau', category: 'unknown' },
  ]) test('Gallery requires visible caption and valid category', () => {
    const ref = {}; widgets['siray-photo'].controlComponent({ value, field: galleryField, forID: 'gallery', getAsset, onChange: () => {} }, ref);
    assert.notEqual(ref.current.isValid(), true);
  });
  test('Collapsed summary includes a photo and visible label', () => {
    const output = render(widgets['siray-photo'].summaryComponent({ value: { ...value, label: 'Un gâteau fleuri' }, getAsset }));
    assert.equal(nodes(output).filter(n => n.type === 'img').length, 1);
    assert.ok(strings(output).includes('Un gâteau fleuri'));
  });
  test('Empty preview provides an understandable placeholder', () => {
    const output = render(widgets['siray-photo'].previewComponent({ value: {}, field, getAsset }));
    assert.equal(nodes(output).filter(n => n.type === 'img').length, 0);
    assert.ok(strings(output).includes('Choisissez une photographie.'));
  });
  let cancellationChanged = false;
  const cancelledControl = widgets['siray-photo'].controlComponent({ value, field, forID: 'cancel', getAsset,
    pickFile: async () => null, onChange: () => cancellationChanged = true }, {});
  await nodes(cancelledControl).find(n => n.props.id === 'cancel').props.onClick();
  test('Cancelling the picker leaves the saved photo untouched', () => assert.equal(cancellationChanged, false));

  const button = (tree,label) => nodes(tree).find(n=>n.type==='button'&&strings(n)===label);
  const clone = value => JSON.parse(JSON.stringify(value));
  async function photoDialogRig({ known = false, gallery = false } = {}) {
    const value = {file:'/images/original.webp',alt:'Ancienne photo',label:'Ancien gâteau',category:'layer-cakes',
      position:'20% 80%',zoom:1.8,retained:'preserved'};
    const selected='blob:https://site.test/new-photo',changes=[],focus=[];
    const source={gallery:known?[{file:selected,alt:'Une pièce en chocolat',label:'Chocolat',category:'cupcakes',position:'35% 60%',zoom:1.2}]:[]};
    const props={value,field:{get:key=>({photo_context:'cover',show_gallery_fields:gallery})[key]},forID:'add-photo',getAsset,
      entry:{get:key=>key==='data'?{toJS:()=>source}:undefined},pickFile:async()=>({value:selected}),onChange:next=>changes.push(next)};
    const oldDoc=sandbox.globalThis.document;
    const doc={body:{style:{overflow:'auto'}},documentElement:{style:{overflow:'clip'}}};sandbox.globalThis.document=doc;
    const trigger={isConnected:true,focus:()=>focus.push('trigger')};
    const dialog={open:false,showModal(){this.open=true;},close(){this.open=false;},
      querySelector:selector=>({focus:()=>focus.push(selector)}),getBoundingClientRect:()=>({left:20,top:20,right:300,bottom:700})};
    const parent=hookRunner(widgets['siray-photo'].controlComponent,props);parent.render();
    await nodes(parent.tree).find(n=>n.props.id==='add-photo').props.onClick({currentTarget:trigger});parent.render();
    const modalNode=nodes(parent.tree).find(n=>n.type?.name==='PhotoMetadataDialog');assert.ok(modalNode,'Chosen photo opens its metadata dialog');
    const modal=hookRunner(modalNode.type,modalNode.props,n=>n.type==='dialog'?dialog:null);modal.render();
    return {value,selected,changes,source,props,parent,modal,dialog,doc,focus,
      input:(key,value)=>{nodes(modal.tree).find(n=>n.props.id===`add-photo-new-photo-${key}`).props.onChange({target:{value}});modal.render();},
      confirm:()=>button(modal.tree,'Utiliser cette photo').props.onClick(),
      dismiss:()=>button(modal.tree,'Annuler').props.onClick(),
      unmount(){modal.unmount();parent.unmount();sandbox.globalThis.document=oldDoc;}};
  }
  const stagedPhoto=await photoDialogRig();
  test('Photo selection opens a naming dialog and makes no editor change before confirmation',()=>{
    assert.equal(stagedPhoto.changes.length,0);assert.equal(stagedPhoto.dialog.open,true);
    assert.equal(stagedPhoto.doc.body.style.overflow,'hidden');
    assert.equal(stagedPhoto.focus[0],'input');assert.ok(strings(stagedPhoto.modal.tree).includes('Catégorie de la galerie'));
    assert.equal(nodes(stagedPhoto.modal.tree).find(n=>n.props.whole===true).props.photo.file,stagedPhoto.selected);
    assert.equal(nodes(stagedPhoto.modal.tree).filter(n=>n.type==='form').length,0);
  });
  test('The metadata confirmation rejects missing values and focuses the missing field',()=>{
    stagedPhoto.confirm();stagedPhoto.modal.render();assert.equal(stagedPhoto.changes.length,0);
    assert.ok(nodes(stagedPhoto.modal.tree).some(n=>n.props.role==='alert'));
    assert.ok(stagedPhoto.focus.at(-1).includes('-label'));
    stagedPhoto.input('label','  Un gâteau fleuri  ');stagedPhoto.confirm();stagedPhoto.modal.render();
    assert.ok(stagedPhoto.focus.at(-1).includes('-category'));
    stagedPhoto.input('category','bento-cakes');stagedPhoto.confirm();stagedPhoto.modal.render();
    assert.ok(stagedPhoto.focus.at(-1).includes('-alt'));
  });
  test('Confirmation writes the classified original blob, resets crop and archives the old photo in one editor change',()=>{
    stagedPhoto.input('alt','  Un petit gâteau aux fleurs blanches  ');stagedPhoto.confirm();stagedPhoto.parent.render();
    assert.equal(stagedPhoto.changes.length,1);const next=stagedPhoto.changes[0];
    assert.equal(next.file,stagedPhoto.selected);assert.equal(next.label,'Un gâteau fleuri');
    assert.equal(next.category,'bento-cakes');assert.equal(next.alt,'Un petit gâteau aux fleurs blanches');
    assert.equal(next.position,'50% 50%');assert.equal(next.zoom,1);assert.equal(next.retained,'preserved');
    assert.equal(next._galleryArchive[0].file,stagedPhoto.value.file);
    assert.ok(!nodes(stagedPhoto.parent.tree).some(n=>n.type?.name==='PhotoMetadataDialog'));
    assert.equal(stagedPhoto.value.position,'20% 80%');stagedPhoto.unmount();
    assert.equal(stagedPhoto.doc.body.style.overflow,'auto');assert.equal(stagedPhoto.doc.documentElement.style.overflow,'clip');
    assert.equal(stagedPhoto.focus.at(-1),'trigger');
  });
  const reusedPhoto=await photoDialogRig({known:true});
  test('Reusing a gallery file preloads its caption, category and accessibility description',()=>{
    assert.equal(nodes(reusedPhoto.modal.tree).find(n=>n.props.id==='add-photo-new-photo-label').props.value,'Chocolat');
    assert.equal(nodes(reusedPhoto.modal.tree).find(n=>n.props.id==='add-photo-new-photo-category').props.value,'cupcakes');
    assert.equal(nodes(reusedPhoto.modal.tree).find(n=>n.props.id==='add-photo-new-photo-alt').props.value,'Une pièce en chocolat');
    assert.equal(nodes(reusedPhoto.modal.tree).find(n=>n.props.id==='add-photo-new-photo-label').props.readOnly,true);
    assert.equal(nodes(reusedPhoto.modal.tree).find(n=>n.props.id==='add-photo-new-photo-category').props.disabled,true);
    assert.ok(strings(reusedPhoto.modal.tree).includes('ouvrez la rubrique Galerie'));
    reusedPhoto.input('label','Ignorer');reusedPhoto.input('category','buffets');reusedPhoto.input('alt','Description de cet emplacement');
    reusedPhoto.confirm();assert.equal(reusedPhoto.changes.length,1);
    assert.equal(reusedPhoto.changes[0].label,'Chocolat');assert.equal(reusedPhoto.changes[0].category,'cupcakes');
    assert.equal(reusedPhoto.changes[0].alt,'Description de cet emplacement');
    assert.equal(reusedPhoto.changes[0].position,'50% 50%');assert.equal(reusedPhoto.source.gallery[0].position,'35% 60%');reusedPhoto.unmount();
  });
  const galleryPhoto=await photoDialogRig({known:true,gallery:true});
  test('Known-file metadata locking does not lock the ordinary gallery editing fields',()=>{
    assert.notEqual(nodes(galleryPhoto.parent.tree).find(n=>n.props.id==='add-photo-label').props.readOnly,true);
    assert.notEqual(nodes(galleryPhoto.parent.tree).find(n=>n.props.id==='add-photo-category').props.disabled,true);
    galleryPhoto.dismiss();galleryPhoto.unmount();
  });
  const cancelledPhoto=await photoDialogRig({known:true});
  test('Cancelling the metadata dialog leaves the chosen upload unreferenced and original photo unchanged',()=>{
    cancelledPhoto.input('label','Ne pas utiliser');cancelledPhoto.dismiss();cancelledPhoto.parent.render();
    assert.equal(cancelledPhoto.changes.length,0);assert.equal(cancelledPhoto.value.label,'Ancien gâteau');
    assert.ok(!nodes(cancelledPhoto.parent.tree).some(n=>n.type?.name==='PhotoMetadataDialog'));cancelledPhoto.unmount();
  });
  const stalePhoto=await photoDialogRig({known:true});
  test('A metadata confirmation cannot overwrite a different source arriving through CMS props',()=>{
    stalePhoto.parent.render({...stalePhoto.props,value:{...stalePhoto.value,file:'/images/elsewhere.webp'}});
    const modalNode=nodes(stalePhoto.parent.tree).find(n=>n.type?.name==='PhotoMetadataDialog');stalePhoto.modal.render(modalNode.props);
    stalePhoto.confirm();stalePhoto.parent.render();assert.equal(stalePhoto.changes.length,0);
    assert.ok(strings(stalePhoto.parent.tree).includes('Cet emplacement a changé'));stalePhoto.unmount();
  });
  function modalRig(overrides = {}) {
    const value = {file:'/images/fullscreen.webp',alt:'Gâteau fleuri',retained:'preserved',...overrides};
    const changes=[], focus=[], lifecycle={show:0,close:0};
    const previousDocument=sandbox.globalThis.document;
    const doc={body:{style:{overflow:'auto'}},documentElement:{style:{overflow:'clip'}}};
    sandbox.globalThis.document=doc;
    const trigger={isConnected:true,focus:options=>focus.push({target:'trigger',options})};
    const dialog={open:false,
      showModal(){this.open=true;lifecycle.show++;},
      close(){this.open=false;lifecycle.close++;},
      querySelector:selector=>{assert.equal(selector,'h2');return {focus:options=>focus.push({target:'heading',options})};},
      getBoundingClientRect:()=>({left:20,top:20,right:300,bottom:700})};
    const props={value,field,forID:'fullscreen-photo',getAsset,onChange:next=>changes.push(next)};
    const parent=hookRunner(widgets['siray-photo'].controlComponent,props);
    parent.render();
    button(parent.tree,'Cadrer en plein écran').props.onClick({currentTarget:trigger});
    parent.render();
    const modalNode=nodes(parent.tree).find(n=>n.type?.name==='FullScreenCrop');
    assert.ok(modalNode,'Fullscreen opens a separate crop component');
    const modal=hookRunner(modalNode.type,modalNode.props,n=>n.type==='dialog'?dialog:null);
    modal.render();
    const cropNode=()=>nodes(modal.tree).find(n=>n.props.cropOnly===true);
    return {value,changes,focus,lifecycle,doc,trigger,dialog,props,parent,modal,cropNode,
      draft:patch=>cropNode().props.onChange({...cropNode().props.value,...patch}),
      confirm:()=>button(modal.tree,'Valider le cadrage').props.onClick(),
      dismiss:()=>button(modal.tree,'Annuler').props.onClick(),
      unmount(){modal.unmount();parent.unmount();sandbox.globalThis.document=previousDocument;}};
  }
  const remainsOpen = rig => nodes(rig.parent.render()).some(n=>n.type?.name==='FullScreenCrop');

  test('Crop patch ignores absent defaults, formatting-only changes and non-crop metadata', () => {
    assert.deepEqual(clone(h.cropPatch({}, {position:'50% 50%',zoom:1,alt:'changed',file:'/other.webp'})),{});
    assert.deepEqual(clone(h.cropPatch({position:'50.000% 65.789%',zoom:1.5}, {position:'50% 65.789%',zoom:1.5})),{});
    assert.deepEqual(clone(h.cropPatch({position:'invalid',zoom:0},{position:'50% 50%',zoom:1})),{});
  });
  test('Crop patch emits both changes together and clamps invalid draft values', () => {
    assert.deepEqual(clone(h.cropPatch({}, {position:'23% 65.789%',zoom:1.52})),{position:'23% 65.789%',zoom:1.52});
    assert.deepEqual(clone(h.cropPatch({position:'30% 20%',zoom:1.5},{position:'999% 0%',zoom:9})),{position:'100% 0%',zoom:2});
  });
  test('Opening the modal labels the native dialog, locks scrolling and focuses its heading once', () => {
    const rig=modalRig(),before=JSON.stringify(rig.value),tree=rig.modal.tree;
    assert.equal(tree.type,'dialog');assert.equal(rig.dialog.open,true);assert.equal(rig.lifecycle.show,1);
    assert.equal(rig.doc.body.style.overflow,'hidden');assert.equal(rig.doc.documentElement.style.overflow,'hidden');
    for(const attr of ['aria-labelledby','aria-describedby']) assert.ok(nodes(tree).some(n=>n.props.id===tree.props[attr]));
    assert.equal(rig.focus.length,1);assert.equal(rig.focus[0].target,'heading');assert.equal(rig.focus[0].options.preventScroll,true);
    rig.modal.render();assert.equal(rig.lifecycle.show,1);assert.equal(rig.changes.length,0);assert.equal(JSON.stringify(rig.value),before);
    assert.ok(strings(tree).includes('puis « Enregistrer » dans l’éditeur pour publier.'));
    rig.unmount();
  });
  test('Fullscreen draft updates its preview while leaving the editor value untouched', () => {
    const rig=modalRig({position:'50% 40%',zoom:1.2}),before=JSON.stringify(rig.value);
    rig.draft({position:'23% 65.789%',zoom:1.6});rig.modal.render();
    assert.equal(rig.cropNode().props.value.position,'23% 65.789%');assert.equal(rig.cropNode().props.value.zoom,1.6);
    assert.equal(rig.changes.length,0);assert.equal(JSON.stringify(rig.value),before);
    const inline=nodes(rig.parent.tree).find(n=>n.props.onPointerDown);
    assert.equal(inline.props.photo.position,'50% 40%');assert.equal(inline.props.photo.zoom,1.2);
    rig.unmount();
  });
  test('Validation applies position and zoom in one editor change without changing metadata', () => {
    const rig=modalRig({position:'50% 50%',zoom:1,label:'Légende',category:'bento-cakes'});
    rig.draft({position:'23% 65.789%',zoom:1.7,alt:'must not replace',label:'must not replace',file:'/other.webp'});
    rig.confirm();assert.equal(rig.changes.length,1);
    assert.deepEqual(clone(rig.changes[0]),{...rig.value,position:'23% 65.789%',zoom:1.7});
    assert.equal(remainsOpen(rig),false);rig.unmount();
  });
  test('Validating an unchanged photo adds no optional defaults and makes no editor change', () => {
    const rig=modalRig();rig.confirm();assert.equal(rig.changes.length,0);assert.equal(remainsOpen(rig),false);
    assert.equal(Object.hasOwn(rig.value,'position'),false);assert.equal(Object.hasOwn(rig.value,'zoom'),false);rig.unmount();
  });
  test('Latest metadata for the same source survives fullscreen validation', () => {
    const rig=modalRig({position:'50% 50%',zoom:1,label:'Avant'});
    rig.draft({position:'30% 70%',zoom:1.4});
    const latest={...rig.value,alt:'Description récente',label:'Après',retained:'new metadata'};
    rig.parent.render({...rig.props,value:latest});assert.equal(remainsOpen(rig),true);
    rig.confirm();assert.equal(rig.changes.length,1);
    assert.deepEqual(clone(rig.changes[0]),{...latest,position:'30% 70%',zoom:1.4});rig.unmount();
  });
  test('A replaced source closes the crop dialog and refuses a stale confirmation', () => {
    const rig=modalRig();rig.draft({position:'30% 70%',zoom:1.4});
    const latest={...rig.value,file:'/images/replaced.webp'};
    rig.parent.render({...rig.props,value:latest});assert.equal(remainsOpen(rig),false);
    rig.confirm();assert.equal(rig.changes.length,0);
    assert.equal(nodes(rig.parent.render()).find(n=>n.props.onPointerDown).props.photo.file,latest.file);rig.unmount();
  });
  test('Changing only the checked format keeps it selected after validation without editing content', () => {
    const rig=modalRig();rig.cropNode().props.onCropViewChange(1);rig.confirm();
    assert.equal(rig.changes.length,0);rig.parent.render();
    assert.equal(nodes(rig.parent.tree).find(n=>n.props.onPointerDown).props.ratio,4/3);rig.unmount();
  });
  for(const mode of ['button','cancel','Escape','backdrop']) test(`Closing by ${mode} discards the crop draft`,()=>{
    const rig=modalRig({position:'50% 50%',zoom:1}),calls={prevent:0,stop:0};
    rig.draft({position:'20% 70%',zoom:1.9});
    const event={preventDefault:()=>calls.prevent++,stopPropagation:()=>calls.stop++};
    if(mode==='button')rig.dismiss();
    if(mode==='cancel')rig.modal.tree.props.onCancel(event);
    if(mode==='Escape')rig.modal.tree.props.onKeyDown({...event,key:'Escape'});
    if(mode==='backdrop') {
      const pointer={currentTarget:rig.dialog,target:rig.dialog,clientX:10,clientY:100,pointerId:1,button:0,isPrimary:true};
      rig.modal.tree.props.onPointerDown(pointer);rig.modal.tree.props.onPointerUp(pointer);
    }
    assert.equal(rig.changes.length,0);assert.equal(remainsOpen(rig),false);
    if(mode==='cancel'||mode==='Escape'){assert.equal(calls.prevent,1);assert.equal(calls.stop,1);}
    rig.unmount();
  });
  // Exercise the actual two dialog components, including their independent
  // local drafts, rather than just a coordinate helper or source-code pattern.
  const backdropCases = [
    ['a short primary tap outside', true, fire => { fire('Down'); fire('Move',{clientX:12}); fire('Up',{clientX:12}); }],
    ['a press retained across a React rerender', true, (fire,rig) => { fire('Down'); rig.modal.render(); fire('Up'); }],
    ['release without a press', false, fire => fire('Up')],
    ['selection beginning inside and ending outside', false, fire => { fire('Down',{clientX:50}); fire('Up'); }],
    ['release inside after an outside press', false, fire => { fire('Down'); fire('Up',{clientX:50}); }],
    ['a content child retaining a pointer outside', false, fire => { fire('Down',{target:{}}); fire('Up',{target:{}}); }],
    ['padding within the dialog bounds', false, fire => { fire('Down',{clientX:50}); fire('Up',{clientX:50}); }],
    ['release from another pointer', false, fire => { fire('Down'); fire('Up',{pointerId:2}); }],
    ['a secondary touch', false, fire => { fire('Down',{isPrimary:false}); fire('Up',{isPrimary:false}); }],
    ['the secondary mouse button', false, fire => { fire('Down',{button:2}); fire('Up',{button:2}); }],
    ['an outside drag returning to its start', false, fire => { fire('Down'); fire('Move',{clientY:140}); fire('Up'); }],
    ['a gesture passing through the dialog', false, fire => { fire('Down'); fire('Move',{clientX:50}); fire('Up'); }],
    ['a cancelled pointer gesture', false, fire => { fire('Down'); fire('Cancel'); fire('Up'); }],
    ['lost pointer capture', false, fire => { fire('Down'); fire('Lost'); fire('Up'); }],
    ['a second finger arriving mid-tap', false, fire => { fire('Down'); fire('Down',{pointerId:2,isPrimary:false}); fire('Up'); }],
    ['window focus lost mid-tap', false, fire => { fire('Down'); for(const listener of windowListeners.get('blur') || [])listener(); fire('Up'); }],
  ];
  for(const kind of ['PhotoMetadataDialog','FullScreenCrop']) for(const [scenario,shouldClose,act] of backdropCases) {
    const rig=kind==='PhotoMetadataDialog'?await photoDialogRig():modalRig();
    test(`${kind} handles ${scenario} without publishing the local draft`,()=>{
      if(kind==='PhotoMetadataDialog')rig.input('label','Mon brouillon conservé');
      else {rig.draft({position:'25% 75%',zoom:1.5});rig.modal.render();}
      const fire=(phase,patch={})=>{
        const handler=phase==='Lost'?'onLostPointerCapture':`onPointer${phase}`;
        rig.modal.tree.props[handler]({currentTarget:rig.dialog,target:rig.dialog,clientX:10,clientY:100,
          pointerId:1,pointerType:'touch',button:phase==='Move'?-1:0,isPrimary:true,...patch});
      };
      const open=()=>nodes(rig.parent.render()).some(n=>n.type?.name===kind);
      act(fire,rig);
      assert.equal(open(),!shouldClose);
      assert.equal(rig.changes.length,0);
      if(!shouldClose) {
        // A cancelled or rejected gesture leaves the draft intact and the very
        // next deliberate backdrop tap still works without reopening anything.
        rig.modal.render();
        if(kind==='PhotoMetadataDialog')assert.equal(nodes(rig.modal.tree).find(n=>n.props.id==='add-photo-new-photo-label').props.value,'Mon brouillon conservé');
        else assert.equal(rig.cropNode().props.value.position,'25% 75%');
        fire('Down');fire('Up');assert.equal(open(),false);assert.equal(rig.changes.length,0);
      }
      rig.unmount();
    });
  }
  test('Native Tab remains usable while editor save shortcuts are blocked inside the modal',()=>{
    const rig=modalRig();
    for(const keys of [{key:'Tab'},{key:'s',ctrlKey:true},{key:'S',metaKey:true}]){
      let prevented=0,stopped=0;
      rig.modal.tree.props.onKeyDown({...keys,preventDefault:()=>prevented++,stopPropagation:()=>stopped++});
      assert.equal(stopped,1);assert.equal(prevented,keys.key==='Tab'?0:1);assert.equal(remainsOpen(rig),true);
    }
    assert.equal(rig.changes.length,0);rig.unmount();
  });
  test('Closing restores original scroll values, closes the dialog and returns focus without scrolling',()=>{
    const rig=modalRig();rig.dismiss();rig.unmount();
    assert.equal(rig.doc.body.style.overflow,'auto');assert.equal(rig.doc.documentElement.style.overflow,'clip');
    assert.equal(rig.dialog.open,false);assert.equal(rig.lifecycle.close,1);
    assert.equal(rig.focus.length,2);assert.equal(rig.focus[1].target,'trigger');assert.equal(rig.focus[1].options.preventScroll,true);
  });
  test('Unmounting an externally closed dialog never focuses a removed trigger or closes it twice',()=>{
    const rig=modalRig();rig.trigger.isConnected=false;rig.dialog.open=false;rig.unmount();
    assert.equal(rig.lifecycle.close,0);assert.equal(rig.focus.length,1);
    assert.equal(rig.doc.body.style.overflow,'auto');assert.equal(rig.doc.documentElement.style.overflow,'clip');
  });
  test('Fullscreen crop uses the chosen site ratio and excludes photo replacement and metadata controls',()=>{
    const rig=modalRig();
    const crop=hookRunner(rig.cropNode().type,{...rig.cropNode().props,initialView:1});crop.render();
    assert.equal(nodes(crop.tree).find(n=>n.props.onPointerDown).props.ratio,4/3);
    assert.equal(nodes(crop.tree).filter(n=>n.type==='input'&&n.props.type==='range').length,3);
    assert.equal(nodes(crop.tree).filter(n=>n.type==='textarea'||n.type==='select').length,0);
    assert.equal(button(crop.tree,'Cadrer en plein écran'),undefined);
    assert.equal(button(crop.tree,'Remplacer la photo'),undefined);
    assert.ok(nodes(crop.tree).some(n=>n.type==='details'));crop.unmount();rig.unmount();
  });
  test('Actual fullscreen pointer gestures update only the live draft and release both fingers on unmount',()=>{
    const rig=modalRig({position:'50% 50%',zoom:1}),captures=new Set(),releases=[];
    const target={querySelector:()=>({naturalWidth:1200,naturalHeight:1600}),
      getBoundingClientRect:()=>({left:0,top:0,width:150,height:200}),
      setPointerCapture:id=>captures.add(id),hasPointerCapture:id=>captures.has(id),
      releasePointerCapture:id=>{captures.delete(id);releases.push(id);}};
    const crop=hookRunner(rig.cropNode().type,rig.cropNode().props);crop.render();
    const event=patch=>({currentTarget:target,pointerId:1,isPrimary:true,pointerType:'touch',button:0,
      clientX:50,clientY:100,preventDefault:()=>{},...patch});
    const frame=nodes(crop.tree).find(n=>n.props.onPointerDown);
    frame.props.onPointerDown(event());frame.props.onPointerDown(event({pointerId:2,isPrimary:false,clientX:100}));
    frame.props.onPointerMove(event({pointerId:2,isPrimary:false,clientX:125}));crop.render();rig.modal.render();
    assert.equal(captures.size,2);assert.equal(rig.changes.length,0);
    assert.equal(nodes(crop.tree).find(n=>n.props.onPointerDown).props.photo.zoom,1.5);
    assert.equal(rig.cropNode().props.value.zoom,1.5);
    crop.unmount();assert.equal(captures.size,0);assert.deepEqual(releases.sort(),[1,2]);
    frame.props.onPointerMove(event({clientX:90}));rig.modal.render();assert.equal(rig.changes.length,0);
    rig.confirm();assert.equal(rig.changes.length,1);assert.equal(rig.changes[0].zoom,1.5);rig.unmount();
  });
  // The gallery widget owns an array rather than one field per row. Exercise
  // its real handlers, including a cancellable unsaved addition, without any
  // file deletion, CMS DOM assumptions or network credentials.
  const galleryWidget = widgets['siray-gallery'];
  const galleryPhotoValue = (index, extra = {}) => ({file:`/images/gallery-${index}.webp`,alt:`Photo ${index}`,
    label:`Création ${index}`,category:index % 2 ? 'cupcakes' : 'bento-cakes',position:'25% 65%',zoom:1.3,
    retained:{order:index},...extra});
  const galleryRows = tree => nodes(tree).filter(n=>n.type==='li' && n.props.className==='siray-gallery-row');
  const photoEditors = tree => nodes(tree).filter(n=>n.type===widgets['siray-photo'].controlComponent);
  const accessibleButton = (tree,label) => nodes(tree).find(n=>n.type==='button' && n.props['aria-label']===label);
  function galleryRig(value, more = {}) {
    const changes=[], ref={};
    const source={gallery:value,homeSlides:[value[0]],homePhotos:{},collections:[]};
    const props={value,forID:'photography-gallery',getAsset,pickFile:async()=>null,
      entry:{get:key=>key==='data'?{toJS:()=>source}:key==='slug'?'photography':undefined},
      onChange:next=>changes.push(next),...more};
    const runner=hookRunner(props=>galleryWidget.controlComponent(props,ref),props);runner.render();
    return {runner,ref,changes,source,props,click(label){button(runner.tree,label).props.onClick();runner.render();},
      clickAccessible(label){accessibleButton(runner.tree,label).props.onClick();runner.render();}};
  }
  test('Gallery field registers alongside the unchanged individual photo editor',()=>{
    assert.equal(typeof galleryWidget.controlComponent,'function');assert.equal(typeof galleryWidget.previewComponent,'function');
    assert.notEqual(galleryWidget.controlComponent,widgets['siray-photo'].controlComponent);
  });
  test('Gallery renders lazy compact rows, counts and filters without mutating its value',()=>{
    const value=Array.from({length:25},(_,i)=>galleryPhotoValue(i,i===7?{trashed:true}:{})),before=JSON.stringify(value);
    const rig=galleryRig(value);assert.equal(rig.changes.length,0);assert.equal(rig.ref.current.isValid(),true);
    assert.equal(galleryRows(rig.runner.tree).length,12);assert.equal(photoEditors(rig.runner.tree).length,0);
    assert.ok(button(rig.runner.tree,'Photos visibles (24)'));assert.ok(button(rig.runner.tree,'Corbeille (1)'));
    assert.ok(button(rig.runner.tree,'Afficher 12 photos de plus'));
    const thumbnails=nodes(render(rig.runner.tree)).filter(n=>n.type==='img');
    assert.equal(thumbnails.length,12);assert.ok(thumbnails.every(n=>n.props.loading==='lazy'));
    assert.equal(JSON.stringify(value),before);rig.runner.unmount();
  });
  test('Moving a photograph to the bin only flags the file and reports its remaining page usage',()=>{
    const value=[galleryPhotoValue(0),galleryPhotoValue(1),galleryPhotoValue(2,{trashed:true})];
    const before=JSON.stringify(value),rig=galleryRig(value),sourceBefore=JSON.stringify(rig.source);
    rig.clickAccessible('Mettre à la corbeille « Création 0 »');assert.equal(rig.changes.length,1);
    assert.deepEqual(clone(rig.changes[0]),value.map((p,i)=>i===0?{...p,trashed:true}:p));
    assert.equal(JSON.stringify(value),before);assert.equal(JSON.stringify(rig.source),sourceBefore);
    assert.ok(strings(rig.runner.tree).includes('Elle reste utilisée sur : Diaporama de l’accueil'));
    assert.ok(button(rig.runner.tree,'Photos visibles (1)'));assert.ok(button(rig.runner.tree,'Corbeille (2)'));
    rig.click('Corbeille (2)');assert.equal(galleryRows(rig.runner.tree).length,2);
    assert.ok(strings(rig.runner.tree).includes('Encore utilisée sur : Diaporama de l’accueil'));
    assert.equal(button(rig.runner.tree,'Ajouter une photo'),undefined);
    assert.ok(!nodes(rig.runner.tree).some(n=>n.type==='button' && /supprimer|vider/i.test(strings(n))));
    rig.clickAccessible('Restaurer « Création 0 »');assert.equal(rig.changes.length,2);
    assert.deepEqual(clone(rig.changes.at(-1)),value);assert.equal('trashed' in rig.changes.at(-1)[0],false);
    rig.runner.unmount();
  });
  test('Each file is trashed together even if a legacy gallery contains duplicates',()=>{
    const p=galleryPhotoValue(0),rig=galleryRig([p,{...p,label:'Ancienne copie'},galleryPhotoValue(1)]);
    rig.clickAccessible('Mettre à la corbeille « Création 0 »');
    assert.equal(rig.changes[0].filter(p=>p.trashed===true).length,2);assert.equal(rig.changes[0][2].trashed,undefined);
    rig.runner.unmount();
  });
  test('Search and category filters change only what is displayed',()=>{
    const rig=galleryRig([galleryPhotoValue(0),galleryPhotoValue(1),galleryPhotoValue(2,{trashed:true})]);
    const search=nodes(rig.runner.tree).find(n=>n.type==='input'&&n.props.type==='search');
    search.props.onChange({target:{value:'CRÉATION 1'}});rig.runner.render();
    assert.equal(galleryRows(rig.runner.tree).length,1);assert.ok(strings(galleryRows(rig.runner.tree)).includes('Création 1'));
    const select=nodes(rig.runner.tree).find(n=>n.type==='select');select.props.onChange({target:{value:'bento-cakes'}});rig.runner.render();
    assert.equal(galleryRows(rig.runner.tree).length,0);assert.ok(strings(rig.runner.tree).includes('Aucune photo ne correspond'));
    assert.equal(rig.changes.length,0);rig.click('Corbeille (1)');assert.equal(galleryRows(rig.runner.tree).length,1);
    assert.equal(nodes(rig.runner.tree).find(n=>n.type==='input'&&n.props.type==='search').props.value,'');rig.runner.unmount();
  });
  test('Visible reordering skips the bin and a restore preserves the retained location and metadata',()=>{
    const value=[galleryPhotoValue(0),galleryPhotoValue(1,{trashed:true}),galleryPhotoValue(2)];
    const rig=galleryRig(value);assert.equal(accessibleButton(rig.runner.tree,'Monter « Création 0 »').props.disabled,true);
    assert.equal(accessibleButton(rig.runner.tree,'Descendre « Création 2 »').props.disabled,true);
    rig.clickAccessible('Monter « Création 2 »');assert.deepEqual(clone(rig.changes.at(-1)),[value[2],value[1],value[0]]);
    rig.click('Corbeille (1)');rig.clickAccessible('Restaurer « Création 1 »');
    assert.deepEqual(clone(rig.changes.at(-1)),[value[2],galleryPhotoValue(1),value[0]]);rig.runner.unmount();
  });
  test('Only one existing photo editor is open and it retains supported CMS upload and entry props',()=>{
    const picker=async()=>({value:'/images/new.webp'}),rig=galleryRig([galleryPhotoValue(0),galleryPhotoValue(1)],{pickFile:picker});
    rig.clickAccessible('Modifier « Création 0 »');let editors=photoEditors(rig.runner.tree);assert.equal(editors.length,1);
    const firstID=editors[0].props.forID;assert.equal(editors[0].props.pickFile,picker);assert.equal(editors[0].props.getAsset,getAsset);
    assert.equal(editors[0].props.entry.get('slug'),'photography');assert.deepEqual(clone(editors[0].props.entry.get('data').gallery),rig.props.value);
    assert.equal(editors[0].props.field.photo_context,'gallery');assert.equal(editors[0].props.field.show_gallery_fields,true);
    editors[0].props.onChange({...editors[0].props.value,alt:'Description actualisée',position:'70% 20%'});rig.runner.render();
    assert.equal(rig.changes.at(-1)[0].retained.order,0);assert.equal(rig.changes.at(-1)[0].position,'70% 20%');
    rig.clickAccessible('Modifier « Création 1 »');editors=photoEditors(rig.runner.tree);assert.equal(editors.length,1);
    assert.notEqual(editors[0].props.forID,firstID);assert.equal(editors[0].props.value.file,rig.props.value[1].file);
    rig.clickAccessible('Fermer les réglages de « Création 1 »');assert.equal(photoEditors(rig.runner.tree).length,0);rig.runner.unmount();
  });
  test('Editing metadata in the bin cannot accidentally restore a photograph',()=>{
    const rig=galleryRig([galleryPhotoValue(0,{trashed:true})]);rig.click('Corbeille (1)');rig.clickAccessible('Modifier « Création 0 »');
    const editor=photoEditors(rig.runner.tree)[0];editor.props.onChange({...editor.props.value,label:'Nom modifié',trashed:false});rig.runner.render();
    assert.equal(rig.changes.at(-1)[0].trashed,true);assert.equal(rig.changes.at(-1)[0].label,'Nom modifié');rig.runner.unmount();
  });
  test('Replacing a binned file requires restoration and a stale picker result cannot reactivate its old archive',()=>{
    const rig=galleryRig([galleryPhotoValue(0,{trashed:true})]);rig.click('Corbeille (1)');rig.clickAccessible('Modifier « Création 0 »');
    const editor=photoEditors(rig.runner.tree)[0];assert.equal(editor.props.allowReplacement,false);
    const child=hookRunner(editor.type,editor.props);child.render();assert.equal(button(child.tree,'Remplacer la photo'),undefined);
    assert.ok(strings(child.tree).includes('Restaurez cette photo dans la galerie pour pouvoir la remplacer'));
    assert.ok(button(child.tree,'Cadrer en plein écran'));assert.ok(nodes(child.tree).some(n=>n.props.id?.endsWith('-label')));
    editor.props.onChange({...editor.props.value,file:'/images/other.webp',_galleryArchive:[galleryPhotoValue(0)]});rig.runner.render();
    assert.equal(rig.changes.length,0);assert.equal(photoEditors(rig.runner.tree).length,0);
    assert.ok(strings(rig.runner.tree).includes('Le fichier conservé dans la corbeille n’a pas changé'));
    child.unmount();rig.runner.unmount();
  });
  test('Adding a photo begins a cancellable local draft and blocks publishing an unfinished addition',()=>{
    const rig=galleryRig([]);assert.equal(rig.ref.current.isValid(),true);rig.click('Ajouter une photo');
    assert.equal(rig.changes.length,0);assert.equal(photoEditors(rig.runner.tree).length,1);
    assert.ok(rig.ref.current.isValid().error.message.includes('Terminez l’ajout'));
    const draft=photoEditors(rig.runner.tree)[0];draft.props.onChange({file:'blob:https://site.test/pending',label:'À classer'});rig.runner.render();
    assert.equal(rig.changes.length,0);assert.notEqual(rig.ref.current.isValid(),true);
    rig.click('Annuler cet ajout');assert.equal(rig.ref.current.isValid(),true);assert.equal(rig.changes.length,0);
    assert.equal(photoEditors(rig.runner.tree).length,0);assert.ok(strings(rig.runner.tree).includes('Aucune photo dans la galerie'));rig.runner.unmount();
  });
  test('A complete classified upload appends once and keeps the new editor visible in a long gallery',()=>{
    const value=Array.from({length:25},(_,i)=>galleryPhotoValue(i)),rig=galleryRig(value);
    rig.click('Ajouter une photo');const draft=photoEditors(rig.runner.tree)[0];
    const addition=galleryPhotoValue(99,{file:'blob:https://site.test/new-upload'});draft.props.onChange(addition);rig.runner.render();
    assert.equal(rig.changes.length,1);assert.equal(rig.changes[0].length,26);assert.equal(rig.changes[0][25].file,addition.file);
    assert.equal(rig.ref.current.isValid(),true);assert.equal(photoEditors(rig.runner.tree).length,1);
    assert.equal(photoEditors(rig.runner.tree)[0].props.value.file,addition.file);assert.equal(galleryRows(rig.runner.tree).length,13);
    assert.ok(strings(galleryRows(rig.runner.tree)[0]).includes('Création 99'));assert.ok(strings(rig.runner.tree).includes('L’ordre de la galerie reste inchangé'));
    assert.deepEqual(clone(rig.changes[0].slice(0,25)),value);rig.runner.unmount();
  });
  test('Picking an existing or binned file through Add never creates a duplicate or restores it silently',()=>{
    const value=[galleryPhotoValue(0),galleryPhotoValue(1,{trashed:true})],rig=galleryRig(value);
    for(const photo of value){rig.click('Ajouter une photo');photoEditors(rig.runner.tree)[0].props.onChange(photo);rig.runner.render();
      assert.equal(rig.changes.length,0);assert.equal(photoEditors(rig.runner.tree).length,0);assert.equal(rig.ref.current.isValid(),true);}
    assert.ok(strings(rig.runner.tree).includes('Ouvrez Corbeille puis touchez « Restaurer »'));rig.runner.unmount();
  });
  test('The gallery rejects malformed records and bin flags while accepting a completely empty gallery',()=>{
    for(const value of [[],[galleryPhotoValue(1)],[galleryPhotoValue(1,{trashed:true})],[galleryPhotoValue(1,{trashed:false})]]) {
      const rig=galleryRig(value);assert.equal(rig.ref.current.isValid(),true);rig.runner.unmount();}
    for(const value of [[{}],[null],[galleryPhotoValue(1,{label:''})],[galleryPhotoValue(1,{trashed:'yes'})]]){
      const rig=galleryRig(value);assert.ok(rig.ref.current.isValid().error.message.includes('Vérifiez le nom'));rig.runner.unmount();}
  });
  test('Gallery and bin thumbnails resolve through getAsset and never render unsafe URLs',()=>{
    const rig=galleryRig([galleryPhotoValue(0),galleryPhotoValue(1,{trashed:true})],{getAsset:()=>({url:'blob:https://site.test/resolved'})});
    let output=render(rig.runner.tree);assert.equal(nodes(output).find(n=>n.type==='img').props.src,'blob:https://site.test/resolved');
    rig.click('Corbeille (1)');output=render(rig.runner.tree);assert.equal(nodes(output).find(n=>n.type==='img').props.src,'blob:https://site.test/resolved');rig.runner.unmount();
    const unsafe=galleryRig([galleryPhotoValue(0,{file:'javascript:alert(1)'})]);
    assert.equal(nodes(render(unsafe.runner.tree)).filter(n=>n.type==='img').length,0);unsafe.runner.unmount();
  });
  test('Native gallery preview hides the bin and limits eagerly constructed photo previews',()=>{
    const value=Array.from({length:10},(_,i)=>galleryPhotoValue(i,i===2?{trashed:true}:{})),before=JSON.stringify(value);
    const output=render(galleryWidget.previewComponent({value,getAsset})),images=nodes(output).filter(n=>n.type==='img');
    assert.equal(images.length,6);assert.ok(images.every(n=>n.props.src!==value[2].file));
    assert.ok(strings(output).includes('9 photos dans la galerie après publication.'));assert.equal(JSON.stringify(value),before);
    const empty=render(galleryWidget.previewComponent({value:[galleryPhotoValue(0,{trashed:true})],getAsset}));
    assert.equal(nodes(empty).filter(n=>n.type==='img').length,0);assert.ok(strings(empty).includes('0 photo dans la galerie'));
  });
  console.log(`${checks} assertions passed; ${photos.length} existing photo controls and native previews render without data mutation.`);
})().catch(error => { console.error(error); process.exitCode = 1; });

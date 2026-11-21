// Verify value preservation, photo controls and the native field-preview bridge
// without a browser or credentials. Real Sveltia upload/save is an integration check.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const repo = path.resolve(__dirname, '../..');
const widgets = {};
const React = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }),
  useState: initial => [initial, () => {}], useEffect: () => {}, useRef: initial => ({current:initial}),
  useImperativeHandle: (ref, get) => { if (ref) ref.current = get(); }, forwardRef: component => component,
};
const sandbox = { globalThis: {}, Intl, Object, Array, Number, String, Error };
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
  test('Upload preserves metadata and raw blob', () => {
    assert.equal(next.file, 'blob:https://site.test/new'); assert.equal(next.alt, value.alt); assert.equal(next.position, '23% 65.789%'); assert.equal(next.retained, 'preserved');
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
  test('Replacing a source cancels both fingers before accepting the new image', () => {
    const rig=replacedDuringPinch,count=rig.changes.length;
    assert.equal(rig.captured.size,0);assert.equal(rig.changes.at(-1).file,'blob:https://site.test/replacement');
    rig.frame.props.onPointerMove(rig.event({pointerId:9,clientX:200}));assert.equal(rig.changes.length,count);
  });
  const replacedDuringDrag=dragRig();
  replacedDuringDrag.frame.props.onPointerDown(replacedDuringDrag.event());
  await nodes(replacedDuringDrag.control).find(n=>n.props.id==='drag').props.onClick();
  test('Replacing a source during a drag cannot overwrite its crop from stale dimensions', () => {
    const rig=replacedDuringDrag,count=rig.changes.length;
    assert.equal(rig.changes.at(-1).file,'blob:https://site.test/replacement');
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
  console.log(`${checks} assertions passed; ${photos.length} existing photo controls and native previews render without data mutation.`);
})().catch(error => { console.error(error); process.exitCode = 1; });

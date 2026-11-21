import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../src/index.js';

// All credentials and responses below are synthetic. No test makes a network request.
const ENV = {
  ALLOWED_DOMAINS: 'siraysignature.fr',
  GITHUB_CLIENT_ID: 'test-client-id',
  GITHUB_CLIENT_SECRET: 'test-client-secret',
};
const STATE = '1234567890abcdef1234567890abcdef';
const ACCESS = 'synthetic-new-access-token';
const REFRESH = 'synthetic-new-refresh-token';
const TOKENS = {
  access_token: ACCESS,
  refresh_token: REFRESH,
  expires_in: 28800,
  refresh_token_expires_in: 15897600,
  token_type: 'bearer',
};
const FLOWS = [
  { type: 'callback', path: '/callback' },
  { type: 'callback', path: '/oauth/redirect' },
  { type: 'refresh', path: '/auth' },
  { type: 'refresh', path: '/oauth/access_token' },
];

function callbackRequest(path = '/callback', { state = STATE, cookie = STATE, query = {} } = {}) {
  const url = new URL(`https://auth.example.test${path}`);
  url.search = new URLSearchParams({ code: 'synthetic-authorization-code', state, ...query });
  return new Request(url, { headers: cookie ? { Cookie: `csrf-token=github_${cookie}` } : {} });
}

function refreshRequest(path = '/auth', { origin = 'https://siraysignature.fr', body = {} } = {}) {
  return new Request(`https://auth.example.test${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) },
    body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: 'synthetic-old-refresh', ...body }),
  });
}

function flowRequest(flow, options) {
  return flow.type === 'callback'
    ? callbackRequest(flow.path, options)
    : refreshRequest(flow.path, options);
}

function mockGitHub(t, {
  profile = { id: 88969314, login: 'sarbhakan' },
  profileStatus = 200,
  profileRaw,
  profileError,
  tokenPayload = TOKENS,
  tokenStatus = 200,
  tokenRaw,
  tokenError,
} = {}) {
  const originalFetch = globalThis.fetch;
  const calls = [];
  let exchangeCount = 0;
  let profileCount = 0;
  globalThis.fetch = async (input, init = {}) => {
    const url = String(input instanceof Request ? input.url : input);
    const headers = new Headers(init.headers);
    calls.push({ url, init, headers });
    if (url === 'https://github.com/login/oauth/access_token') {
      exchangeCount += 1;
      if (tokenError) throw tokenError;
      const payload = typeof tokenPayload === 'function' ? tokenPayload(exchangeCount) : tokenPayload;
      return tokenRaw === undefined
        ? Response.json(payload, { status: tokenStatus })
        : new Response(tokenRaw, { status: tokenStatus });
    }
    if (url === 'https://api.github.com/user') {
      // Workers does not implement Fetch's `error` redirect mode, unlike Node.
      // Match its construction-time failure so a Node-only mock cannot hide a regression.
      if (init.redirect === 'error') throw new TypeError('Unsupported redirect policy: error');
      profileCount += 1;
      if (profileError) throw profileError;
      const payload = typeof profile === 'function' ? profile(profileCount) : profile;
      return profileRaw === undefined
        ? Response.json(payload, { status: profileStatus })
        : new Response(profileRaw, { status: profileStatus });
    }
    assert.fail(`Unexpected network request: ${url}`);
  };
  t.after(() => { globalThis.fetch = originalFetch; });
  return { calls, get exchangeCount() { return exchangeCount; }, get profileCount() { return profileCount; } };
}

function assertNoCredentials(text) {
  assert.ok(!text.includes(ACCESS), 'a rejected response must not disclose the new access token');
  assert.ok(!text.includes(REFRESH), 'a rejected response must not disclose the new refresh token');
  assert.ok(!text.includes(ENV.GITHUB_CLIENT_SECRET), 'client secret must never reach the browser');
}

async function assertRejected(response, flow, callbackCode, refreshCode, refreshStatus) {
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const text = await response.text();
  assertNoCredentials(text);
  if (flow.type === 'callback') {
    assert.ok(text.includes('authorization:github:error'), 'CMS must receive an OAuth error');
    assert.ok(text.includes(callbackCode), `expected ${callbackCode}`);
    assert.ok(!text.includes('authorization:github:success'));
  } else {
    assert.equal(response.status, refreshStatus);
    const body = JSON.parse(text);
    assert.equal(body.error, refreshCode);
    assert.ok(!Object.hasOwn(body, 'access_token'));
    assert.ok(!Object.hasOwn(body, 'refresh_token'));
  }
}

for (const flow of FLOWS) {
  for (const profile of [
    { id: 88969314, login: 'sarbhakan' },
    { id: 359602650, login: 'selinberrin12' },
  ]) {
    test(`${flow.path} ${flow.type}: permits ${profile.login} using authenticated immutable ID`, async (t) => {
      const mocked = mockGitHub(t, { profile });
      const response = await worker.fetch(flowRequest(flow), ENV);
      const text = await response.text();
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.ok(text.includes(ACCESS));
      assert.ok(text.includes(REFRESH));
      assert.ok(!text.includes(ENV.GITHUB_CLIENT_SECRET));
      if (flow.type === 'callback') assert.ok(text.includes('authorization:github:success'));
      else assert.equal(JSON.parse(text).expires_in, 28800);
      assert.equal(mocked.exchangeCount, 1);
      assert.equal(mocked.profileCount, 1);
      const verification = mocked.calls.find(({ url }) => url === 'https://api.github.com/user');
      assert.equal(verification.headers.get('authorization'), `Bearer ${ACCESS}`);
      assert.equal(verification.headers.get('x-github-api-version'), '2026-03-10');
      assert.equal(verification.init.redirect, 'manual', 'Workers must not forward a bearer token through redirects');
      assert.ok(verification.init.signal instanceof AbortSignal, 'identity lookup must have a timeout');
    });
  }

  test(`${flow.path} ${flow.type}: a renamed allowed account keeps access by ID`, async (t) => {
    mockGitHub(t, { profile: { id: 359602650, login: 'renamed-sister' } });
    const response = await worker.fetch(flowRequest(flow), ENV);
    assert.ok((await response.text()).includes(ACCESS));
  });

  for (const login of ['unrelated-person', 'sarbhakan', 'selinberrin12']) {
    test(`${flow.path} ${flow.type}: refuses non-allowed ID even when login is ${login}`, async (t) => {
      const mocked = mockGitHub(t, { profile: { id: 999999999, login } });
      const response = await worker.fetch(flowRequest(flow, {
        query: { login: 'sarbhakan', user_id: '88969314' },
        body: { login: 'sarbhakan', user_id: 88969314 },
      }), ENV);
      await assertRejected(response, flow, 'USER_NOT_ALLOWED', 'access_denied', 403);
      assert.equal(mocked.profileCount, 1);
    });
  }
}

const VERIFICATION_FAILURES = [
  ['HTTP 301 redirect', { profileStatus: 301 }],
  ['HTTP 302 redirect', { profileStatus: 302 }],
  ['HTTP 307 redirect', { profileStatus: 307 }],
  ['HTTP 308 redirect', { profileStatus: 308 }],
  ['HTTP 400', { profileStatus: 400 }],
  ['HTTP 403', { profileStatus: 403 }],
  ['HTTP 500', { profileStatus: 500 }],
  ['malformed JSON', { profileRaw: '{invalid' }],
  ['network failure', { profileError: new Error(`network failure ${ACCESS} ${REFRESH}`) }],
  ['redirect rejection', { profileError: new TypeError('fetch failed: unexpected redirect') }],
  ['timeout', { profileError: new DOMException('The operation timed out', 'TimeoutError') }],
  ...[undefined, null, '88969314', true, 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1].map((id) => [
    `malformed id ${String(id)}`, { profile: { id, login: 'sarbhakan' } },
  ]),
];

for (const flow of [FLOWS[0], FLOWS[2]]) {
  for (const [name, config] of VERIFICATION_FAILURES) {
    test(`${flow.type}: fails closed on identity ${name}`, async (t) => {
      mockGitHub(t, config);
      await assertRejected(await worker.fetch(flowRequest(flow), ENV), flow,
        'USER_VERIFICATION_FAILED', 'user_verification_failed', 502);
    });
  }

  for (const tokenPayload of [{}, { refresh_token: REFRESH }, { access_token: 42 }, { access_token: '' }]) {
    test(`${flow.type}: never accepts an exchange without a string access token: ${JSON.stringify(tokenPayload)}`, async (t) => {
      const mocked = mockGitHub(t, { tokenPayload });
      await assertRejected(await worker.fetch(flowRequest(flow), ENV), flow,
        'MALFORMED_RESPONSE', 'malformed_response', 502);
      assert.equal(mocked.profileCount, 0);
    });
  }

  test(`${flow.type}: a GitHub OAuth error cannot forward accompanying token fields`, async (t) => {
    const mocked = mockGitHub(t, { tokenPayload: { error: 'bad_verification_code', ...TOKENS } });
    const response = await worker.fetch(flowRequest(flow), ENV);
    const text = await response.text();
    assertNoCredentials(text);
    if (flow.type === 'callback') {
      assert.ok(text.includes('authorization:github:error'));
      assert.ok(text.includes('bad_verification_code'));
    } else assert.deepEqual(JSON.parse(text), { error: 'bad_verification_code' });
    assert.equal(mocked.profileCount, 0);
  });

  for (const tokenStatus of [400, 500]) {
    test(`${flow.type}: token exchange HTTP ${tokenStatus} fails before identity lookup`, async (t) => {
      const mocked = mockGitHub(t, { tokenStatus });
      await assertRejected(await worker.fetch(flowRequest(flow), ENV), flow,
        'TOKEN_REQUEST_FAILED', 'token_request_failed', 502);
      assert.equal(mocked.profileCount, 0);
    });
  }
}

for (const flow of FLOWS.filter(({ type }) => type === 'callback')) {
  for (const options of [{ cookie: null }, { cookie: 'ffffffffffffffffffffffffffffffff' }]) {
    test(`${flow.path}: missing or mismatched CSRF cookie cannot exchange a code (${String(options.cookie)})`, async (t) => {
      const mocked = mockGitHub(t);
      await assertRejected(await worker.fetch(flowRequest(flow, options), ENV), flow, 'CSRF_DETECTED');
      assert.equal(mocked.calls.length, 0);
    });
  }

  test(`${flow.path}: cancelled GitHub authorization never exchanges a code`, async (t) => {
    const mocked = mockGitHub(t);
    const request = new Request(`https://auth.example.test${flow.path}?error=access_denied&state=${STATE}`,
      { headers: { Cookie: `csrf-token=github_${STATE}` } });
    await assertRejected(await worker.fetch(request, ENV), flow, 'AUTH_CODE_REQUEST_FAILED');
    assert.equal(mocked.calls.length, 0);
  });
}

for (const path of ['/auth', '/oauth/authorize']) {
  test(`${path}: refuses another website before redirect or token exchange`, async (t) => {
    const mocked = mockGitHub(t);
    const request = new Request(`https://auth.example.test${path}?provider=github&site_id=siraysignature.fr.evil.test`);
    await assertRejected(await worker.fetch(request, ENV), { type: 'callback' }, 'UNSUPPORTED_DOMAIN');
    assert.equal(mocked.calls.length, 0);
  });
}

for (const flow of FLOWS.filter(({ type }) => type === 'refresh')) {
  for (const origin of [null, 'null', 'https://evil.test', 'https://siraysignature.fr.evil.test']) {
    test(`${flow.path}: refuses refresh origin ${String(origin)} before exchange`, async (t) => {
      const mocked = mockGitHub(t);
      await assertRejected(await worker.fetch(flowRequest(flow, { origin }), ENV), flow,
        undefined, 'unsupported_domain', 403);
      assert.equal(mocked.calls.length, 0);
    });
  }

  test(`${flow.path}: refresh re-verifies identity each time using the newly issued access token`, async (t) => {
    const mocked = mockGitHub(t, {
      tokenPayload: (count) => ({ ...TOKENS, access_token: `${ACCESS}-${count}` }),
      profile: (count) => count === 1
        ? { id: 88969314, login: 'sarbhakan' }
        : { id: 999999999, login: 'sarbhakan' },
    });
    const accepted = await worker.fetch(flowRequest(flow), ENV);
    assert.equal((await accepted.json()).access_token, `${ACCESS}-1`);
    const denied = await worker.fetch(flowRequest(flow), ENV);
    const text = await denied.text();
    assert.equal(denied.status, 403);
    assert.equal(JSON.parse(text).error, 'access_denied');
    assertNoCredentials(text);
    assert.equal(mocked.profileCount, 2);
    assert.deepEqual(mocked.calls.filter(({ url }) => url === 'https://api.github.com/user')
      .map(({ headers }) => headers.get('authorization')), [`Bearer ${ACCESS}-1`, `Bearer ${ACCESS}-2`]);
  });
}

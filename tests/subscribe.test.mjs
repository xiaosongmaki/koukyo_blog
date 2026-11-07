import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/subscribe.ts';

test('subscription protection and signed cross-subscription', async () => {
  process.env.VERCEL_ENV = 'production';
  process.env.RESEND_API_KEY = 'test-resend';
  delete process.env.TURNSTILE_SECRET_KEY;
  const originalFetch = globalThis.fetch;
  let calls = [];
  let verified = true;
  globalThis.fetch = async (url) => {
    calls.push(url);
    if (url.includes('siteverify')) return Response.json({ success: verified });
    if (url.endsWith('/audiences')) return Response.json({ data: [{ id: 'general', name: 'General' }] });
    return Response.json({ ok: true });
  };
  async function request(body) {
    const res = { setHeader() {}, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
    await handler({ method: 'POST', body }, res);
    return res;
  }
  try {
    assert.equal((await request({ email: 'a@example.com' })).code, 503);
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';
    assert.equal((await request({ email: 'a@example.com' })).code, 400);
    assert.equal((await request({ email: 'a@example.com', website: 'spam' })).code, 200);
    assert.equal(calls.length, 0);
    verified = false;
    assert.equal((await request({ email: 'a@example.com', token: 'invalid' })).code, 400);
    assert.equal(calls.length, 1);
    globalThis.fetch = async () => { throw new Error('offline'); };
    assert.equal((await request({ email: 'a@example.com', token: 'valid' })).code, 502);
    globalThis.fetch = async (url) => {
      calls.push(url);
      if (url.includes('siteverify')) return Response.json({ success: true });
      if (url.endsWith('/audiences')) return Response.json({ data: [{ id: 'general', name: 'General' }] });
      return Response.json({ ok: true });
    };
    const success = await request({ email: 'a@example.com', token: 'valid' });
    assert.equal(success.code, 200);
    assert.ok(success.body.token);
    const count = calls.length;
    assert.equal((await request({ email: 'other@example.com', also: 'reddit_radar', token: success.body.token })).code, 400);
    assert.equal(calls.length, count);
    process.env.WINDMILL_RADAR_SUBSCRIBE_TOKEN = 'test-radar';
    assert.equal((await request({ email: 'a@example.com', also: 'reddit_radar', token: success.body.token })).code, 200);
    assert.equal(calls.length, count + 1);
    assert.ok(calls.at(-1).includes('reddit_radar_subscribe'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

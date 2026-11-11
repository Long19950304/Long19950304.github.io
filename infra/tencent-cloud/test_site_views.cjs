const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const code = fs.readFileSync('assets/js/site-views.js', 'utf8');

function page(fetch, visibility = 'visible') {
  const elements = Object.fromEntries(['total', 'base', 'base-note'].map((key) => [key, { hidden: true, textContent: '' }]));
  const counter = {
    dataset: { locale: 'zh' }, hidden: true,
    querySelector: (selector) => elements[selector.slice(11, -1)],
  };
  const listeners = {};
  const document = {
    visibilityState: visibility,
    querySelector: () => counter,
    addEventListener: (name, callback) => { listeners[name] = callback; },
    removeEventListener: (name) => { delete listeners[name]; },
  };
  const context = vm.createContext({ document, window: { crypto: webcrypto }, fetch, Uint8Array });
  vm.runInContext(code, context);
  return { context, counter, elements, listeners, document };
}
const tick = () => new Promise((resolve) => setImmediate(resolve));
const response = (data) => ({ ok: true, json: async () => data });

test('shows total and explicitly disclosed initial base, and runs once per document', async () => {
  let calls = 0;
  const p = page(async () => { calls += 1; return response({ total: 618, initial_base: 617, observed: 1 }); });
  await tick();
  vm.runInContext(code, p.context);
  await tick();
  assert.equal(calls, 1);
  assert.equal(p.counter.hidden, false);
  assert.equal(p.elements.total.textContent, '618');
  assert.equal(p.elements.base.textContent, '617');
  assert.equal(p.elements['base-note'].hidden, false);
});

test('retry reuses the view ID after a network failure', async () => {
  const bodies = [];
  const p = page(async (_, options) => {
    bodies.push(JSON.parse(options.body));
    if (bodies.length === 1) throw new Error('connection lost after server committed');
    return response({ total: 618, initial_base: 617, observed: 1 });
  });
  await tick();
  assert.equal(bodies.length, 2);
  assert.equal(bodies[0].event_id, bodies[1].event_id);
  assert.equal(p.counter.hidden, false);
});

test('background documents wait until visible; a fresh document gets a different ID', async () => {
  const ids = [];
  const fetch = async (_, options) => { ids.push(JSON.parse(options.body).event_id); return response({ total: 1, initial_base: 0, observed: 1 }); };
  const p = page(fetch, 'hidden');
  await tick();
  assert.equal(ids.length, 0);
  p.listeners.visibilitychange();
  assert.equal(ids.length, 0);
  p.document.visibilityState = 'visible';
  p.listeners.visibilitychange();
  await tick();
  assert.equal(p.listeners.visibilitychange, undefined);
  page(fetch);
  await tick();
  assert.equal(ids.length, 2);
  assert.notEqual(ids[0], ids[1]);
  assert.equal(p.elements['base-note'].hidden, true);
});

test('failure and invalid totals remain hidden without a fabricated fallback', async () => {
  for (const fetch of [async () => { throw new Error('offline'); }, async () => response({ total: 999, initial_base: 617, observed: 1 })]) {
    const p = page(fetch);
    await tick();
    assert.equal(p.counter.hidden, true);
    assert.equal(p.elements.total.textContent, '');
  }
});

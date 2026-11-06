// Playback state tests use simulated media events, without network or a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const script = fs.readFileSync(path.join(__dirname, '../../assets/js/digest-card-player.js'), 'utf8');

class Element {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.events = {};
    this.attributes = {};
    this.hidden = true;
    this.value = '0';
    this.textContent = '';
    this.classes = new Set();
    this.classList = { add: (name) => this.classes.add(name) };
  }
  addEventListener(name, fn) { (this.events[name] ||= []).push(fn); }
  emit(name) { return Promise.all((this.events[name] || []).map((fn) => fn())); }
  setAttribute(name, value) { this.attributes[name] = value; }
}

class Audio extends Element {
  constructor(id) {
    super();
    this.id = id;
    this.paused = true;
    this.ended = false;
    this.duration = NaN;
    this.currentTime = 0;
    this.plays = 0;
  }
  play() {
    this.plays += 1;
    this.paused = false;
    this.emit('play');
    return this.result || Promise.resolve();
  }
  pause() {
    if (!this.paused) { this.paused = true; this.emit('pause'); }
  }
}

function fixture() {
  const audio = [new Audio('zh'), new Audio('en')];
  const buttons = audio.map((a) => new Element({ digestPlay: a.id, state: 'idle', labelPlay: 'Play', labelPause: 'Pause', labelLoading: 'Loading' }));
  const status = new Element({ ready: 'Ready', loading: 'Loading', playing: 'Playing', paused: 'Paused', ended: 'Ended', error: 'Error' });
  const progress = new Element();
  const seek = new Element();
  const elapsed = new Element();
  const total = new Element();
  const panel = new Element();
  const nodes = { '[data-digest-player-status]': status, '[data-digest-progress]': progress, '[data-digest-seek]': seek, '[data-digest-elapsed]': elapsed, '[data-digest-total]': total };
  panel.querySelector = (s) => nodes[s];
  panel.querySelectorAll = () => buttons;
  const window = new Element();
  const document = { querySelectorAll: (s) => s === '[data-digest-recording]' ? audio : [panel], getElementById: (id) => audio.find((a) => a.id === id) };
  vm.runInNewContext(script, { document, window });
  return { audio, buttons, status, progress, seek, elapsed, total, panel, window };
}

test('does not autoplay; buttons play/pause and language switches never overlap', async () => {
  const f = fixture();
  assert.equal(f.audio[0].plays + f.audio[1].plays, 0);
  assert.ok(f.panel.classes.has('is-enhanced'));
  await f.buttons[0].emit('click');
  assert.equal(f.buttons[0].dataset.state, 'playing');
  assert.equal(f.progress.hidden, false);
  await f.buttons[1].emit('click');
  assert.equal(f.audio[0].paused, true);
  assert.equal(f.audio[1].paused, false);
  assert.equal(f.buttons[0].attributes['aria-pressed'], 'false');
  await f.buttons[1].emit('click');
  assert.equal(f.audio[1].paused, true);
  assert.equal(f.status.textContent, 'Paused');
});

test('progress waits for metadata, updates and seeks; ended audio can replay', async () => {
  const f = fixture();
  await f.buttons[0].emit('click');
  assert.equal(f.seek.disabled, true);
  f.audio[0].duration = 656.4;
  f.audio[0].currentTime = 65;
  await f.audio[0].emit('loadedmetadata');
  assert.equal(f.seek.disabled, false);
  assert.equal(f.elapsed.textContent, '1:05');
  assert.equal(f.total.textContent, '10:56');
  f.seek.value = '500';
  await f.seek.emit('input');
  assert.equal(f.audio[0].currentTime, 328.2);
  f.audio[0].ended = true;
  f.audio[0].paused = true;
  await f.audio[0].emit('ended');
  assert.equal(f.status.textContent, 'Ended');
  await f.buttons[0].emit('click');
  assert.equal(f.audio[0].currentTime, 0);
});

test('rejected play and media errors offer a retry without hiding native fallback prematurely', async () => {
  const f = fixture();
  f.audio[0].result = Promise.reject(new Error('network'));
  await f.buttons[0].emit('click');
  assert.equal(f.status.textContent, 'Error');
  assert.equal(f.buttons[0].dataset.state, 'idle');
  f.audio[0].result = null;
  await f.buttons[0].emit('click');
  assert.equal(f.buttons[0].dataset.state, 'playing');
  await f.audio[0].emit('error');
  assert.equal(f.status.textContent, 'Error');
  assert.equal(f.buttons[0].attributes['aria-busy'], 'false');
});

test('a slow cancelled play cannot restart after switching language', async () => {
  const f = fixture();
  let resolve;
  f.audio[0].result = new Promise((done) => { resolve = done; });
  const pending = f.buttons[0].emit('click');
  assert.equal(f.buttons[0].dataset.state, 'loading');
  await f.buttons[1].emit('click');
  resolve();
  await pending;
  assert.equal(f.audio[0].paused, true);
  assert.equal(f.buttons[1].dataset.state, 'playing');
  assert.equal(f.buttons[0].dataset.state, 'idle');
});

test('external pause, filtering or leaving cancels a pending play request', async () => {
  for (const action of ['pause', 'pagehide']) {
    const f = fixture();
    let resolve;
    f.audio[0].result = new Promise((done) => { resolve = done; });
    const pending = f.buttons[0].emit('click');
    if (action === 'pause') f.audio[0].pause();
    else await f.window.emit('pagehide');
    resolve();
    await pending;
    assert.equal(f.audio[0].paused, true);
    assert.equal(f.buttons[0].dataset.state, 'idle');
  }
});

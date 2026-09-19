const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/character-export.js'), 'utf8');

function setup(options = {}) {
  let click;
  const calls = { shares: [], copies: [], fallback: 0 };
  const nodes = {
    'display-name': { textContent: 'Ada' },
    'display-concept': { textContent: 'Quiet Scholar', classList: { contains: () => false } },
    'share-character': { addEventListener: (_, handler) => { click = handler; } },
    'export-status': { textContent: '' }
  };
  const navigator = {
    userAgent: options.mobile ? 'iPhone' : 'Desktop',
    platform: options.ipad ? 'MacIntel' : '',
    maxTouchPoints: options.ipad ? 5 : 0,
    clipboard: { writeText: async value => { calls.copies.push(value); if (options.clipboardFail) throw Error(); } },
    share: async data => {
      calls.shares.push(data.text);
      if (options.error) throw { name: options.error };
    }
  };
  if (options.unsupported) delete navigator.share;
  if (options.cannotShare) navigator.canShare = () => false;
  vm.runInNewContext(source, {
    navigator, window: { isSecureContext: true },
    document: {
      getElementById: id => nodes[id], querySelectorAll: () => [],
      createElement: () => ({ setAttribute() {}, style: {}, select() {}, remove() {} }),
      body: { appendChild() {} },
      execCommand: () => { calls.fallback++; return !options.fallbackFail; }
    },
    clearTimeout() {}, setTimeout() {}
  });
  return { click: () => click(), calls, status: nodes['export-status'] };
}

test('desktop copies exact sheet text even when native sharing exists', async () => {
  const s = setup(); await s.click();
  assert.deepEqual(s.calls.copies, ['Ada\nQuiet Scholar\n\n']);
  assert.equal(s.calls.shares.length, 0); assert.equal(s.status.textContent, 'Copied.');
});
test('phone and iPad share the sheet text without copying', async () => {
  for (const options of [{ mobile: true }, { ipad: true }]) {
    const s = setup(options); await s.click();
    assert.deepEqual(s.calls.shares, ['Ada\nQuiet Scholar\n\n']); assert.equal(s.calls.copies.length, 0);
  }
});
test('cancel does not copy, report an error, or block the next click', async () => {
  const s = setup({ mobile: true, error: 'AbortError' }); await s.click(); await s.click();
  assert.equal(s.calls.shares.length, 2); assert.equal(s.calls.copies.length, 0); assert.equal(s.status.textContent, '');
});
test('unavailable, unsupported, and failed native sharing fall back to copying', async () => {
  for (const extra of [{ unsupported: true }, { cannotShare: true }, { error: 'NotAllowedError' }]) {
    const s = setup({ mobile: true, ...extra }); await s.click();
    assert.deepEqual(s.calls.copies, ['Ada\nQuiet Scholar\n\n']); assert.equal(s.status.textContent, 'Copied.');
  }
});
test('clipboard failure uses the legacy fallback and reports total failure honestly', async () => {
  for (const fallbackFail of [false, true]) {
    const s = setup({ clipboardFail: true, fallbackFail }); await s.click();
    assert.equal(s.calls.fallback, 1);
    assert.equal(s.status.textContent, fallbackFail ? 'Could not copy. Select and copy the character text.' : 'Copied.');
  }
});
test('repeated clicks during sharing start only one operation', async () => {
  const s = setup({ mobile: true }); await Promise.all([s.click(), s.click()]);
  assert.equal(s.calls.shares.length, 1);
});

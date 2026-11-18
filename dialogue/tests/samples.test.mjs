import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {sampleBundle} from '../build-samples.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const rooftop = "Title: Rooftop\n\n[[rdg\nTone: Standoff\nStart: Vance corners Marcus on the roof, convinced he leaked confidential files.\nEnd: Marcus hands over his passkey and reveals that he was protecting his sister.\n]]\n\n[[character: Agent Vance\nVoice: Controlled, precise. Asks questions already knowing the answer.\nWant: Recover the files before anyone else sees them.\nObstacle: Marcus is the only person who knows where the backup is.\n]]\n\n[[character: Marcus\nVoice: Defensive humor that cracks under pressure.\nWant: Get his sister safely out of the city.\nObstacle: Vance is blocking the only exit.\n]]\n\nEXT. HIGH-RISE ROOFTOP \u2014 RAINY NIGHT\n\nRain ticks against a ventilation duct. MARCUS keeps one hand in his coat. VANCE watches that hand.\n\nAGENT VANCE\nThe lift is locked.\n\nMARCUS\nI noticed. Very welcoming building.\n\nAGENT VANCE\nTake your hand out. Slowly.\n\nMarcus produces a small plastic passkey. He holds it over the edge.\n\nMARCUS\nThere\u2019s a car downstairs. Blue. Engine running.\n\nAGENT VANCE\nYour driver can wait.\n\nMARCUS\nShe\u2019s fourteen. She can\u2019t drive.\n\nVance lowers the radio without switching it on.\n\nAGENT VANCE\nWho else knows she\u2019s there?\n\nMARCUS\nEveryone I stole those files from.\n\nHe sets the passkey on the duct between them. Neither reaches for it.\n";
function element() {
  return {value:'', children:[], dataset:{}, elements:{'character-gender':{value:''}},
    append(...items) { this.children.push(...items); },
    replaceChildren(...items) { this.children = items; },
    setAttribute() {}, addEventListener() {}, querySelectorAll() { return []; }};
}
async function page(entries, files = {}) {
  const nodes = new Map();
  const node = id => { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); };
  const requests = [];
  const context = vm.createContext({document:{getElementById:node, querySelectorAll:()=>[], createElement:element},
    CharacterLibrary:{list:()=>[]}, window:{DIALOGUE_SAMPLES: entries?.map(entry =>
      typeof entry === 'string' ? {file:entry, source:files[entry]} : entry)}, console,
    fetch: async url => {
      requests.push(url);
      throw new Error('Local file fetch is blocked');
    }});
  vm.runInContext(read('fountain-parser.js'), context);
  // Run the real application with network fetch blocked, as on file://.
  await vm.runInContext(read('app.js').replace(/loadSamples\(\);\s*$/, 'loadSamples()'), context);
  return {node, requests, context};
}

test('local-file loader works with fetch blocked and fills setup, preview, cast and download control', async () => {
  const {node,requests,context} = await page(['rooftop.fountain'], {'rooftop.fountain':rooftop});
  assert.deepEqual(requests, []);
  assert.equal(node('tone').value, 'Standoff');
  assert.equal(node('screenplay').children.length, 13);
  assert.equal(vm.runInContext('selected.size',context), 2);
  assert.equal(node('generate').disabled, false);
  assert.equal(node('download').disabled, false);
  assert.equal(node('randomize').disabled, true);
});

test('20 bundled samples need no startup fetch and randomize switches the complete scene', async () => {
  const entries = Array.from({length:20}, (_,i)=>({file:`scene-${i}.fountain`, source:rooftop.replace('Title: Rooftop', `Title: Scene ${i}`)}));
  const {node, requests, context} = await page(entries);
  assert.equal(requests.length, 0);
  assert.equal(vm.runInContext('scenes.length',context), 20);
  assert.equal(node('randomize').disabled, false);
  node('randomize').onclick();
  assert.notEqual(vm.runInContext('sceneIndex',context), 0);
  assert.equal(node('screenplay').children.length, 13);
  assert.equal(vm.runInContext('selected.size',context), 2);
});

test('unavailable and invalid samples report errors while valid samples remain usable', async () => {
  const {node,context} = await page(['missing.fountain','bad.fountain','rooftop.fountain'], {
    'bad.fountain':'Not a screenplay', 'rooftop.fountain':rooftop});
  assert.equal(vm.runInContext('scenes.length',context), 1);
  assert.match(node('status').textContent, /missing.fountain/);
  assert.match(node('status').textContent, /bad.fountain/);
  assert.equal(node('generate').disabled, false);
  assert.equal(node('download').disabled, false);
});

test('missing bundle, empty bundle and invalid paths leave explicit errors and disabled controls', async () => {
  for (const entries of [undefined, [], ['../private.fountain']]) {
    const {node,requests} = await page(entries);
    assert.match(node('status').textContent, /Samples could not be loaded/);
    assert.equal(node('generate').disabled, true);
    assert.equal(node('copy').disabled, true);
    assert.equal(requests.length, 0);
  }
});

test('switching to a setup-only sample clears the previous screenplay and selects its cast', async () => {
  const {node,context} = await page([
    {file:'rooftop.fountain', source:rooftop},
    {file:'laundromat.fountain', source:"Title: laundromat\n\n[[rdg\nTone: Sitcom\nStart: Two strangers discover that each has one half of a torn winning lottery ticket.\nEnd: They agree to split the prize, then notice the draw date is tomorrow.\n]]\n\n[[character: Nora\nVoice: Dry, practical, suspicious of good luck.\nWant: Finish the laundry and avoid getting involved.\nObstacle: The stranger will not give back her half of the ticket.\n]]\n\n[[character: Eli\nVoice: Overconfident, chatty; bargains when nervous.\nWant: Convince Nora they are destined to win.\nObstacle: He has been wrong about every prediction tonight.\n]]\n\nINT. ALL-NIGHT LAUNDROMAT \u2014 3 A.M.\n"}
  ]);
  node('randomize').onclick();
  assert.equal(node('tone').value,'Sitcom');
  assert.equal(node('screenplay').children.length,1);
  assert.equal(vm.runInContext('selected.size',context),2);
});


test('checked-in preload matches Fountain sources and page loads it before the app', () => {
  assert.equal(read('samples.js'), sampleBundle());
  const html = read('index.html');
  assert.ok(html.indexOf('src="fountain-parser.js"') < html.indexOf('src="samples.js"'));
  assert.ok(html.indexOf('src="samples.js"') < html.indexOf('src="app.js"'));
  const bundleContext = vm.createContext({window:{}});
  vm.runInContext(read('samples.js'), bundleContext);
  assert.equal(bundleContext.window.DIALOGUE_SAMPLES.length, 1);
  assert.equal(bundleContext.window.DIALOGUE_SAMPLES[0].source, read('samples/the-price-of-the-living.fountain'));
});


test('Fountain export contains the displayed script and its matching setup, even after form edits', async () => {
  const {node, context} = await page([{file:'rooftop.fountain', source:rooftop}]);
  node('tone').value = 'Unsaved changes';
  const original = vm.runInContext('FountainParser.parse(window.DIALOGUE_SAMPLES[0].source)', context);
  const exported = vm.runInContext('FountainParser.parse(fountainText())', context);
  assert.deepEqual(exported.blocks, original.blocks);
  assert.deepEqual(exported.characters, original.characters);
  assert.equal(exported.tone, 'Standoff');
  assert.equal(exported.location, original.location);
});

test('download dropdown exports current dialogue in either format and resets for repeat downloads', async () => {
  const {node,context} = await page([{file:'rooftop.fountain', source:rooftop}]);
  const blobs = [], downloads = [], revoked = [];
  context.Blob = Blob;
  context.URL = {createObjectURL(blob) { blobs.push(blob); return 'blob:export-' + blobs.length; },
    revokeObjectURL(url) { revoked.push(url); }};
  context.setTimeout = fn => fn();
  context.document.createElement = () => ({click() { downloads.push(this.download); }});
  vm.runInContext("script = [{type:'dialogue',speaker:'Marcus',text:'Freshly generated dialogue.'}];",context);
  for (const format of ['txt','fountain','fountain']) {
    node('download').value = format;
    node('download').onchange();
    assert.equal(node('download').value, '');
  }
  assert.deepEqual(downloads, ['dialogue-scene.txt','dialogue-scene.fountain','dialogue-scene.fountain']);
  assert.match(await blobs[0].text(), /MARCUS\nFreshly generated dialogue\./);
  assert.match(await blobs[1].text(), /@Marcus\nFreshly generated dialogue\./);
  assert.equal(revoked.length, 3);
});

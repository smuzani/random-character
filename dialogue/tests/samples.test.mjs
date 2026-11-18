import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {sampleBundle} from '../build-samples.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
import {screenplay, setupOnly} from './fixtures.mjs';
function element() {
  return {value:'', children:[], dataset:{}, elements:{'character-gender':{value:''}},
    append(...items) { this.children.push(...items); },
    replaceChildren(...items) { this.children = items; },
    setAttribute() {}, addEventListener() {}, showModal() {}, querySelectorAll() { return []; }};
}
async function page(entries, files = {}) {
  const nodes = new Map();
  const node = id => { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); };
  const requests = [];
  const genderOptions = ['male', 'female', ''].map(value => ({...element(), value}));
  const context = vm.createContext({TMALE:'male', TFEMALE:'female', document:{getElementById:node, createElement:element,
    querySelectorAll: selector => selector === '[name="character-gender"]' ? genderOptions : []},
    CharacterLibrary:{list:()=>[]}, window:{DIALOGUE_SAMPLES: entries?.map(entry =>
      typeof entry === 'string' ? {file:entry, source:files[entry]} : entry)}, console,
    fetch: async url => {
      requests.push(url);
      throw new Error('Local file fetch is blocked');
    }});
  vm.runInContext(read('fountain-parser.js'), context);
  // Run the real application with network fetch blocked, as on file://.
  await vm.runInContext(read('app.js').replace(/loadSamples\(\);\s*$/, 'loadSamples()'), context);
  return {node, requests, context, genderOptions};
}

test('the bundled cast opens with their genders selected and keeps them in Fountain export', async () => {
  const file = 'the-price-of-the-living.fountain';
  const {context, genderOptions} = await page([file], {[file]:read('samples/' + file)});
  const expected = {Huang:'male', 'Overseer Lila':'female', 'Dr Nick':'male', Arif:'male', Guard:'male'};
  for (const [name, gender] of Object.entries(expected)) {
    vm.runInContext(`openCharacter(sceneCharacters().find(character => character.name === ${JSON.stringify(name)}))`, context);
    assert.deepEqual(genderOptions.filter(option => option.checked).map(option => option.value), [gender]);
  }
  const exported = vm.runInContext('FountainParser.parse(fountainText())', context);
  assert.deepEqual(Object.fromEntries(exported.characters.map(character => [character.name, character.gender])), expected);
});

test('local-file loader works with fetch blocked and fills setup, preview, cast and download control', async () => {
  const {node,requests,context} = await page(['fixture.fountain'], {'fixture.fountain':screenplay});
  assert.deepEqual(requests, []);
  assert.equal(node('tone').value, 'Standoff');
  assert.equal(node('screenplay').children.length, 4);
  assert.equal(vm.runInContext('selected.size',context), 2);
  assert.equal(node('generate').disabled, false);
  assert.equal(node('download').disabled, false);
  assert.equal(node('randomize').disabled, true);
});

test('20 bundled samples need no startup fetch and randomize switches the complete scene', async () => {
  const entries = Array.from({length:20}, (_,i)=>({file:`scene-${i}.fountain`, source:screenplay.replace('Title: Parser fixture', `Title: Scene ${i}`)}));
  const {node, requests, context} = await page(entries);
  assert.equal(requests.length, 0);
  assert.equal(vm.runInContext('scenes.length',context), 20);
  assert.equal(node('randomize').disabled, false);
  node('randomize').onclick();
  assert.notEqual(vm.runInContext('sceneIndex',context), 0);
  assert.equal(node('screenplay').children.length, 4);
  assert.equal(vm.runInContext('selected.size',context), 2);
});

test('unavailable and invalid samples report errors while valid samples remain usable', async () => {
  const {node,context} = await page(['missing.fountain','bad.fountain','fixture.fountain'], {
    'bad.fountain':'Not a screenplay', 'fixture.fountain':screenplay});
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
    {file:'fixture.fountain', source:screenplay},
    {file:'setup-only.fountain', source:setupOnly}
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
  const files = JSON.parse(read('samples/index.json'));
  assert.deepEqual(Array.from(bundleContext.window.DIALOGUE_SAMPLES, entry => ({file:entry.file, source:entry.source})),
    files.map(file => ({file, source:read('samples/' + file)})));
});


test('Fountain export contains the displayed script and its matching setup, even after form edits', async () => {
  const {node, context} = await page([{file:'fixture.fountain', source:screenplay}]);
  node('tone').value = 'Unsaved changes';
  const original = vm.runInContext('FountainParser.parse(window.DIALOGUE_SAMPLES[0].source)', context);
  const exported = vm.runInContext('FountainParser.parse(fountainText())', context);
  assert.deepEqual(exported.blocks, original.blocks);
  assert.deepEqual(exported.characters, original.characters);
  assert.equal(exported.tone, 'Standoff');
  assert.equal(exported.location, original.location);
});

test('download dropdown exports current dialogue in either format and resets for repeat downloads', async () => {
  const {node,context} = await page([{file:'fixture.fountain', source:screenplay}]);
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

test('preview renders Fountain emphasis as safe elements and keeps literal HTML as text', async () => {
  const {context} = await page([{file:'fixture.fountain', source:screenplay}]);
  context.document.createElement = tag => ({...element(), tag});
  const output = vm.runInContext(`(() => {
    const target = document.createElement('p');
    appendFountainText(target, 'A **bold** *italic* _underlined_ ***both*** <img src=x>');
    return target;
  })()`, context);
  const formatted = output.children.filter(child => typeof child !== 'string');
  assert.deepEqual(formatted.map(child => child.tag), ['strong', 'em', 'u', 'strong']);
  assert.deepEqual(formatted.slice(0, 3).map(child => child.textContent), ['bold', 'italic', 'underlined']);
  assert.equal(formatted[3].children[0].tag, 'em');
  assert.equal(formatted[3].children[0].textContent, 'both');
  assert.equal(output.children.at(-1), ' <img src=x>');
});

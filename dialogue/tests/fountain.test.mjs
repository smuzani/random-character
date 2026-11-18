import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {parse} = createRequire(import.meta.url)('../fountain-parser.js');
const source = readFileSync(new URL('../samples/rooftop.fountain', import.meta.url), 'utf8');

test('rooftop preserves setup, cast and all screenplay blocks', () => {
  const scene = parse(source);
  assert.equal(scene.title, 'Rooftop');
  assert.equal(scene.tone, 'Standoff');
  assert.equal(scene.characters[0].name, 'Agent Vance');
  assert.equal(scene.characters.length, 2);
  assert.equal(scene.blocks.length, 12);
  assert.deepEqual(scene.blocks[1], {type:'dialogue', speaker:'Agent Vance', text:'The lift is locked.'});
  assert.equal(scene.blocks.at(-1).text, 'He sets the passkey on the duct between them. Neither reaches for it.');
});

test('code fences, CRLF, decorated metadata and forced speaker cues', () => {
  const decorated = source.replace('Tone:', '**TONE:**').replace('Want:', '*Want*:').replace('AGENT VANCE\n', '@Agent Vance\n');
  assert.deepEqual(parse('```fountain\r\n' + decorated.replaceAll('\n','\r\n') + '\r\n```'), parse(source));
});

test('preserves multiline dialogue, parentheticals and emphasis', () => {
  const scene = parse(source.replace('The lift is locked.', '(quietly)\nThe lift is **locked**.\nBoth doors.'));
  assert.equal(scene.blocks[1].text, '(quietly)\nThe lift is **locked**.\nBoth doors.');
});

test('reports missing metadata, unknown speakers and multiple scenes', () => {
  assert.throws(() => parse(source.replace('Tone: Standoff\n', '')), /Missing scene tone/);
  assert.throws(() => parse(source.replace('AGENT VANCE\n', 'VANEC\n')), /Unknown speaker: VANEC/);
  assert.throws(() => parse(source + '\nINT. OFFICE - DAY\n'), /exactly one scene/);
  assert.throws(() => parse(source.replace('[[rdg', '[[rdg\nTone: Duplicate')), /Duplicate field/);
});

test('every indexed sample parses; setup-only scenes remain available', () => {
  const files = JSON.parse(readFileSync(new URL('../samples/index.json', import.meta.url), 'utf8'));
  assert.equal(files.length, 4);
  const scenes = files.map(file => parse(readFileSync(new URL('../samples/' + file, import.meta.url), 'utf8')));
  assert.equal(scenes[1].tone, 'Sitcom');
  assert.equal(scenes[1].blocks.length, 0);
});

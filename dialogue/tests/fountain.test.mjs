import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {parse} = createRequire(import.meta.url)('../fountain-parser.js');
import {screenplay as source} from './fixtures.mjs';

test('parser preserves setup, cast and all screenplay blocks', () => {
  const scene = parse(source);
  assert.equal(scene.title, 'Parser fixture');
  assert.equal(scene.tone, 'Standoff');
  assert.equal(scene.characters[0].name, 'Agent Vance');
  assert.equal(scene.characters.length, 2);
  assert.equal(scene.blocks.length, 3);
  assert.deepEqual(scene.blocks[1], {type:'dialogue', speaker:'Agent Vance', text:'The lift is locked.'});
  assert.equal(scene.blocks.at(-1).text, 'May I have the key?');
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

test('every indexed product sample parses with dialogue and a declared cast', () => {
  const files = JSON.parse(readFileSync(new URL('../samples/index.json', import.meta.url), 'utf8'));
  assert.ok(files.length > 0);
  for (const file of files) {
    const scene = parse(readFileSync(new URL('../samples/' + file, import.meta.url), 'utf8'));
    assert.ok(scene.title, file);
    assert.ok(scene.blocks.some(block => block.type === 'dialogue'), file);
    const cast = new Set(scene.characters.map(character => character.name));
    for (const block of scene.blocks.filter(block => block.type === 'dialogue')) {
      assert.ok(cast.has(block.speaker), `${file}: ${block.speaker}`);
    }
  }
});

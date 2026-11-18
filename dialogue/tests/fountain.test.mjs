import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {parse} = createRequire(import.meta.url)('../fountain-parser.js');
const source = "Title: Rooftop\n\n[[rdg\nTone: Standoff\nStart: Vance corners Marcus on the roof, convinced he leaked confidential files.\nEnd: Marcus hands over his passkey and reveals that he was protecting his sister.\n]]\n\n[[character: Agent Vance\nVoice: Controlled, precise. Asks questions already knowing the answer.\nWant: Recover the files before anyone else sees them.\nObstacle: Marcus is the only person who knows where the backup is.\n]]\n\n[[character: Marcus\nVoice: Defensive humor that cracks under pressure.\nWant: Get his sister safely out of the city.\nObstacle: Vance is blocking the only exit.\n]]\n\nEXT. HIGH-RISE ROOFTOP \u2014 RAINY NIGHT\n\nRain ticks against a ventilation duct. MARCUS keeps one hand in his coat. VANCE watches that hand.\n\nAGENT VANCE\nThe lift is locked.\n\nMARCUS\nI noticed. Very welcoming building.\n\nAGENT VANCE\nTake your hand out. Slowly.\n\nMarcus produces a small plastic passkey. He holds it over the edge.\n\nMARCUS\nThere\u2019s a car downstairs. Blue. Engine running.\n\nAGENT VANCE\nYour driver can wait.\n\nMARCUS\nShe\u2019s fourteen. She can\u2019t drive.\n\nVance lowers the radio without switching it on.\n\nAGENT VANCE\nWho else knows she\u2019s there?\n\nMARCUS\nEveryone I stole those files from.\n\nHe sets the passkey on the duct between them. Neither reaches for it.\n";

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

test('the only indexed sample is The Price of the Living', () => {
  const files = JSON.parse(readFileSync(new URL('../samples/index.json', import.meta.url), 'utf8'));
  assert.deepEqual(files, ['the-price-of-the-living.fountain']);
  const scenes = files.map(file => parse(readFileSync(new URL('../samples/' + file, import.meta.url), 'utf8')));
  assert.equal(scenes[0].title, 'THE PRICE OF THE LIVING');
  assert.equal(scenes[0].characters.length, 5);
  assert.match(scenes[0].blocks.at(-1).text, /we must renegotiate/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import handler,{validate,parseScene} from '../netlify/functions/generate.mjs';
import {generateScene} from '../../supabase/functions/_shared/generation.mjs';
import {fountainBody} from './fixtures.mjs';
const scene={location:'A roof',start:'They meet',end:'They leave',tone:'Drama',length:'short',characters:[{name:'A',voice:'Quiet',want:'Leave',obstacle:'B'},{name:'B',voice:'Loud',want:'Stay',obstacle:'A'}]};
test('rejects invalid input and duplicate characters before AI calls',async()=>{
 assert.throws(()=>validate({...scene,characters:[scene.characters[0]]}));assert.throws(()=>validate({...scene,characters:[scene.characters[0],scene.characters[0]]}));
 assert.equal((await handler(new Request('https://example.com/api/generate',{method:'POST',body:'bad'}))).status,400);
 assert.equal((await handler(new Request('https://example.com/api/generate',{method:'POST',headers:{origin:'https://other.com'},body:JSON.stringify(scene)}))).status,403);
});
test('rejects malformed model output and unrequested speakers',()=>{
 assert.throws(()=>parseScene('{"blocks":[]}',scene.characters), /Expected a forced Fountain/);
 assert.throws(()=>parseScene('!Rain.\n\n@C\nGo.\n\n@B\nNo.',scene.characters), /Unknown speaker/);
 assert.throws(()=>parseScene('!Rain.\n\n@A\n\n@B\nNo.',scene.characters), /Missing dialogue/);
});

test('reads a Fountain body using supplied cast names and preserves multiline text', () => {
 const characters = [{name: 'Dr. A_B'}, {name: 'Émilie'}];
 const raw = '```fountain\r\n!THE DOOR SLAMS.\r\n\r\n@dr. a_b\r\n(quietly)\r\n**Go.**\r\n\r\n@Émilie\r\nNo.\r\n```';
 assert.deepEqual(parseScene(raw, characters), [
  {type: 'action', text: 'THE DOOR SLAMS.'},
  {type: 'dialogue', speaker: 'Dr. A_B', text: '(quietly)\n**Go.**'},
  {type: 'dialogue', speaker: 'Émilie', text: 'No.'}
 ]);
});

test('generates an ending when omitted or blank and follows a supplied ending', async () => {
 const blocks = [{type: 'action', text: 'Rain.'}, {type: 'dialogue', speaker: 'A', text: 'Go.'}, {type: 'dialogue', speaker: 'B', text: 'No.'}];
 for (const end of [undefined, '', ' \n ', ' They leave ']) {
  const setup = validate({...scene, end});
  assert.equal(setup.end, end?.trim() ?? '');
  const result = await generateScene(setup, {key: 'test-secret', fetchProvider: async (_, options) => {
   const request = JSON.parse(options.body);
   const prompt = request.systemInstruction.parts[0].text;
   assert.match(prompt, setup.end ? /Reach the supplied ending/ : /Invent a surprising ending/);
   assert.doesNotMatch(prompt, setup.end ? /Invent a surprising ending/ : /Reach the supplied ending/);
   assert.match(prompt, /Fountain scene body/);
   assert.equal(request.generationConfig.responseMimeType, 'text/plain');
   assert.equal(JSON.parse(request.contents[0].parts[0].text).end, setup.end);
   return Response.json({candidates: [{finishReason: 'STOP', content: {parts: [{text: fountainBody(blocks)}]}}]});
  }});
  assert.deepEqual(result.blocks, blocks);
 }
 assert.throws(() => validate({...scene, end: 'x'.repeat(701)}), /Check the end field/);
 assert.throws(() => validate({...scene, end: 42}), /Check the end field/);
});

test('requires a spoken line from each selected character for every cast size', () => {
 for (let size = 2; size <= 6; size++) {
  const characters = Array.from({length: size}, (_, index) => ({name: `Character ${index + 1}`}));
  const turns = characters.map(({name}) => ({type: 'dialogue', speaker: ` ${name.toLowerCase()} `, text: 'A line.'}));
  const last = characters.at(-1).name;
  const action = {type: 'action', text: `${last} looks up.`};
  const partial = [action, ...turns.slice(0, -1), {...turns[0], text: `Look at ${last}.`}];
  assert.throws(() => parseScene(fountainBody(partial), characters), /missing dialogue/);
  const complete = parseScene(fountainBody([action, ...turns]), characters);
  assert.deepEqual(complete.slice(1).map(block => block.speaker), characters.map(character => character.name));
 }
});

test('retries an omitted third speaker once and never returns a partial cast', async t => {
 const oldKey = process.env.GEMINI_API_KEY;
 process.env.GEMINI_API_KEY = 'test-secret';
 t.after(() => {
  if (oldKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = oldKey;
 });
 const trio = {...scene, tone: 'Interrogation', characters: [...scene.characters, {name: 'C', gender: 'female', voice: 'Direct', want: 'Get an answer', obstacle: 'A is stalling'}]};
 const partial = [{type: 'action', text: 'C watches the exit.'}, {type: 'dialogue', speaker: 'A', text: 'Go.'}, {type: 'dialogue', speaker: 'B', text: 'No.'}];
 const complete = [...partial, {type: 'dialogue', speaker: 'C', text: 'The exit is locked.'}];
 for (const recovers of [true, false]) {
  await t.test(recovers ? 'returns the complete retry' : 'reports the missing speaker', async t => {
   const calls = t.mock.method(globalThis, 'fetch', async (_, options) => {
    const blocks = recovers && calls.mock.callCount() === 1 ? complete : partial;
    return Response.json({candidates: [{finishReason: 'STOP', content: {parts: [{text: fountainBody(blocks)}]}}]});
   });
   const response = await handler(new Request('https://example.com/api/generate', {method: 'POST', body: JSON.stringify(trio)}));
   assert.equal(calls.mock.callCount(), 2);
   const [, retryOptions] = calls.mock.calls[1].arguments;
   const retry = JSON.parse(JSON.parse(retryOptions.body).contents[0].parts[0].text);
   assert.deepEqual(retry.characters, trio.characters);
   assert.deepEqual(retry.missingSpeakers, ['C']);
   assert.equal(retryOptions.signal, calls.mock.calls[0].arguments[1].signal);
   const body = await response.json();
   if (recovers) {
    assert.equal(response.status, 200);
    assert.deepEqual(body.blocks, complete);
   } else {
    assert.equal(response.status, 502);
    assert.match(body.error, /dialogue for: C/);
    assert.equal(body.blocks, undefined);
   }
  });
 }
});
test('handles genuine provider response shape without exposing secrets',async()=>{
 const oldFetch=globalThis.fetch,oldKey=process.env.GEMINI_API_KEY;process.env.GEMINI_API_KEY='test-secret';
 const blocks=[{type:'action',text:'Rain.'},{type:'dialogue',speaker:'A',text:'Go.'},{type:'dialogue',speaker:'B',text:'No.'}];
 try{globalThis.fetch=async()=>Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:fountainBody(blocks)}]}}]});const response=await handler(new Request('https://example.com/api/generate',{method:'POST',body:JSON.stringify(scene)}));assert.equal(response.status,200);assert.deepEqual((await response.json()).blocks,blocks);
 globalThis.fetch=async()=>Response.json({error:{message:'test-secret'}},{status:401});const failed=await handler(new Request('https://example.com/api/generate',{method:'POST',body:JSON.stringify(scene)}));assert.equal(failed.status,503);assert.equal((await failed.text()).includes('test-secret'),false);
 }finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;}
});

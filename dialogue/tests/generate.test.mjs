import test from 'node:test';
import assert from 'node:assert/strict';
import handler,{validate,parseScene} from '../netlify/functions/generate.mjs';
const scene={location:'A roof',start:'They meet',end:'They leave',tone:'Drama',length:'short',characters:[{name:'A',voice:'Quiet',want:'Leave',obstacle:'B'},{name:'B',voice:'Loud',want:'Stay',obstacle:'A'}]};
test('rejects invalid input and duplicate characters before AI calls',async()=>{
 assert.throws(()=>validate({...scene,characters:[scene.characters[0]]}));assert.throws(()=>validate({...scene,characters:[scene.characters[0],scene.characters[0]]}));
 assert.equal((await handler(new Request('https://example.com/api/generate',{method:'POST',body:'bad'}))).status,400);
 assert.equal((await handler(new Request('https://example.com/api/generate',{method:'POST',headers:{origin:'https://other.com'},body:JSON.stringify(scene)}))).status,403);
});
test('rejects malformed model output and unrequested speakers',()=>{
 assert.throws(()=>parseScene('{"blocks":[]}',scene.characters));
 assert.throws(()=>parseScene(JSON.stringify({blocks:[{type:'action',text:'Hi'},{type:'dialogue',speaker:'C',text:'Hi'},{type:'dialogue',speaker:'B',text:'Hi'}]}),scene.characters));
});

test('requires a spoken line from each selected character for every cast size', () => {
 for (let size = 2; size <= 6; size++) {
  const characters = Array.from({length: size}, (_, index) => ({name: `Character ${index + 1}`}));
  const turns = characters.map(({name}) => ({type: 'dialogue', speaker: ` ${name.toLowerCase()} `, text: 'A line.'}));
  const last = characters.at(-1).name;
  const action = {type: 'action', text: `${last} looks up.`};
  const partial = [action, ...turns.slice(0, -1), {...turns[0], text: `Look at ${last}.`}];
  assert.throws(() => parseScene(JSON.stringify({blocks: partial}), characters), /missing dialogue/);
  const complete = parseScene(JSON.stringify({blocks: [action, ...turns]}), characters);
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
 const trio = {...scene, tone: 'Interrogation', characters: [...scene.characters, {name: 'C', voice: 'Direct', want: 'Get an answer', obstacle: 'A is stalling'}]};
 const partial = [{type: 'action', text: 'C watches the exit.'}, {type: 'dialogue', speaker: 'A', text: 'Go.'}, {type: 'dialogue', speaker: 'B', text: 'No.'}];
 const complete = [...partial, {type: 'dialogue', speaker: 'C', text: 'The exit is locked.'}];
 for (const recovers of [true, false]) {
  await t.test(recovers ? 'returns the complete retry' : 'reports the missing speaker', async t => {
   const calls = t.mock.method(globalThis, 'fetch', async (_, options) => {
    const blocks = recovers && calls.mock.callCount() === 1 ? complete : partial;
    return Response.json({candidates: [{finishReason: 'STOP', content: {parts: [{text: JSON.stringify({blocks})}]}}]});
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
 try{globalThis.fetch=async()=>Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({blocks})}]}}]});const response=await handler(new Request('https://example.com/api/generate',{method:'POST',body:JSON.stringify(scene)}));assert.equal(response.status,200);assert.deepEqual((await response.json()).blocks,blocks);
 globalThis.fetch=async()=>Response.json({error:{message:'test-secret'}},{status:401});const failed=await handler(new Request('https://example.com/api/generate',{method:'POST',body:JSON.stringify(scene)}));assert.equal(failed.status,503);assert.equal((await failed.text()).includes('test-secret'),false);
 }finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;}
});

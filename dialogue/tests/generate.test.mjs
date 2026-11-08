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
test('handles genuine provider response shape without exposing secrets',async()=>{
 const oldFetch=globalThis.fetch,oldKey=process.env.GEMINI_API_KEY;process.env.GEMINI_API_KEY='test-secret';
 const blocks=[{type:'action',text:'Rain.'},{type:'dialogue',speaker:'A',text:'Go.'},{type:'dialogue',speaker:'B',text:'No.'}];
 try{globalThis.fetch=async()=>Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({blocks})}]}}]});const response=await handler(new Request('https://example.com/api/generate',{method:'POST',body:JSON.stringify(scene)}));assert.equal(response.status,200);assert.deepEqual((await response.json()).blocks,blocks);
 globalThis.fetch=async()=>Response.json({error:{message:'test-secret'}},{status:401});const failed=await handler(new Request('https://example.com/api/generate',{method:'POST',body:JSON.stringify(scene)}));assert.equal(failed.status,503);assert.equal((await failed.text()).includes('test-secret'),false);
 }finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;}
});

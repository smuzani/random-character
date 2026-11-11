import test from 'node:test';
import assert from 'node:assert/strict';
import {createService} from '../../supabase/functions/_shared/service.mjs';
import {generateScene} from '../../supabase/functions/_shared/generation.mjs';
const scene={location:'A roof',start:'They meet',end:'They leave',tone:'Drama',length:'short',characters:[{name:'A',voice:'Quiet',want:'Leave',obstacle:'B'},{name:'B',voice:'Loud',want:'Stay',obstacle:'A'}]};
const complete=[{type:'action',text:'Rain.'},{type:'dialogue',speaker:'A',text:'Go.'},{type:'dialogue',speaker:'B',text:'No.'}];
const request=(body=scene,headers={})=>new Request('https://example.supabase.co/functions/v1/dialogue',{method:'POST',headers,body:JSON.stringify(body)});
function setup(extra={}) {
 const calls=[],logs=[];
 const rpc=async(action,data)=>{calls.push({action,data});if(action==='catalog')return {models:[{id:'test',guestDefault:true}]};if(action==='begin')return {maxOutputTokens:1000};if(action==='finish')return {status:data.success?'succeeded':'failed'};return {};};
 return {calls,logs,handler:createService({rpc,authenticate:async()=>null,key:'secret',allowedOrigin:'https://example.com',log:entry=>logs.push(entry),...extra})};
}
test('Edge adapter runs shared generation, reserves each retry and traces metadata',async()=>{
 let count=0;
 const {handler,calls,logs}=setup({generate:(scene,options)=>generateScene(scene,{...options,fetchProvider:async()=>Response.json({usageMetadata:{promptTokenCount:10,candidatesTokenCount:20},candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({blocks:count++===0 ? [complete[0],complete[1],complete[1]] : complete})}]}}]})})});
 const response=await handler(request());const data=await response.json();
 assert.equal(response.status,200);assert.deepEqual(data.blocks,complete);assert.match(data.guestToken,/^[a-f0-9]{64}$/);
 assert.deepEqual(calls.filter(c=>c.action==='reserve_call').map(c=>c.data.attempt),[0,1]);
 assert.deepEqual(calls.filter(c=>c.action==='record_attempt').map(c=>c.data.validation),['missing_cast','passed']);
 assert.equal(calls.at(-1).data.success,true);
 assert.equal(logs[0].requestId,data.requestId);
 assert.equal(JSON.stringify(logs).includes('secret'),false);assert.equal(JSON.stringify(logs).includes('They meet'),false);
});
test('failed generation releases the reservation and returns a request ID',async()=>{
 const {handler,calls}=setup({generate:async()=>{throw new Error('secret provider body');}});
 const response=await handler(request());const data=await response.json();
 assert.equal(response.status,503);assert.equal(calls.at(-1).action,'finish');assert.equal(calls.at(-1).data.success,false);
 assert.equal(data.requestId,response.headers.get('X-Request-ID'));assert.equal(JSON.stringify(data).includes('secret'),false);
});
test('invalid identity, malformed scene and foreign origin never reserve credits',async()=>{
 const {handler,calls}=setup();
 assert.equal((await handler(request(scene,{Authorization:'Bearer invalid'}))).status,401);
 assert.equal((await handler(request({...scene,characters:[]}))).status,400);
 assert.equal((await handler(request(scene,{Origin:'https://evil.example'}))).status,403);
 assert.equal(calls.length,0);
});
test('budget denial prevents a provider call and keeps the actionable error',async()=>{
 let fetched=false;
 await assert.rejects(generateScene(scene,{key:'secret',beforeCall:async()=>{throw Object.assign(new Error('budget'),{publicMessage:'Guest generation is unavailable. Sign in to continue.'});},fetchProvider:async()=>{fetched=true;}}),error=>!!error.publicMessage);
 assert.equal(fetched,false);
});

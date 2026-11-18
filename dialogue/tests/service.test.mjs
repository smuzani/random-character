import test from 'node:test';
import assert from 'node:assert/strict';
import {createRpc, createService, hashGuest} from '../../supabase/functions/_shared/service.mjs';
import {generateScene} from '../../supabase/functions/_shared/generation.mjs';
import {fountainBody} from './fixtures.mjs';
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
 const {handler,calls,logs}=setup({generate:(scene,options)=>generateScene(scene,{...options,fetchProvider:async()=>Response.json({usageMetadata:{promptTokenCount:10,candidatesTokenCount:20},candidates:[{finishReason:'STOP',content:{parts:[{text:fountainBody(count++===0 ? [complete[0],complete[1],complete[1]] : complete)}]}}]})})});
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
test('an invalid Fountain response fails without settling a scene charge', async () => {
 const {handler,calls,logs} = setup({generate:(scene,options)=>generateScene(scene,{
  ...options,
  fetchProvider:async()=>Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:'@Unknown\nPrivate script.'}]}}]})
 })});
 const response = await handler(request());
 const data = await response.json();
 assert.equal(response.status, 502);
 assert.match(data.error, /unreadable scene/);
 assert.equal(data.requestId, response.headers.get('X-Request-ID'));
 assert.equal(calls.at(-1).action, 'finish');
 assert.equal(calls.at(-1).data.success, false);
 assert.equal(JSON.stringify(logs).includes('Private script.'), false);
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
test('guest catalogs look up the remaining scenes using the hashed session token',async()=>{
 const guestToken='a'.repeat(64);
 const guestHash=await hashGuest(guestToken);
 const rpc=createRpc('https://example.supabase.co','test-key',async(url,options)=>{
  if(url.endsWith('/dialogue_service')) return Response.json({models:[]});
  assert.ok(url.endsWith('/dialogue_guest_remaining'));
  const {p_guest_hash}=JSON.parse(options.body);
  assert.ok(p_guest_hash===null || p_guest_hash===guestHash);
  return Response.json(p_guest_hash===null ? 10 : 0);
 });
 const {handler}=setup({rpc});
 assert.equal((await (await handler(request({action:'catalog'}))).json()).guestRemaining,10);
 assert.equal((await (await handler(request({action:'catalog',guestToken}))).json()).guestRemaining,0);
});

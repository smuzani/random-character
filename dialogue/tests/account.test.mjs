import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import proxy from '../netlify/functions/account.mjs';
const code=readFileSync(new URL('../account.js',import.meta.url),'utf8');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function browser({signedIn=false,sendError=null,dialogue=true}={}) {
 const fields=new Map();
 const element=id=>{
  if(!fields.has(id)) fields.set(id,{value:id==='length'?'medium':id==='account-email'?'test@example.com':'',hidden:false,disabled:false,textContent:'',reportValidity:()=>true,showModal(){this.open=true;},setAttribute(){},addEventListener(){},replaceChildren(...children){this.children=children;}});
  return fields.get(id);
 };
 let session=signedIn?{access_token:'user-token',user:{id:'test-user'}}:null;
 const requests=[],signIns=[],storage=new Map();
 let settings,authListener;
 const sdk={createClient:(url,key,options)=>{
  settings={url,key,options};
  return {auth:{getSession:async()=>({data:{session},error:null}),signInWithOtp:async input=>{signIns.push(input);return {error:sendError};},signOut:async()=>{session=null;return {error:null};},onAuthStateChange:fn=>{authListener=fn;}}};
 }};
 const context={window:{DIALOGUE_CONFIG:{url:'https://example.supabase.co',key:'sb_publishable_test'},supabase:sdk},document:{getElementById:id=>!dialogue && id==='model'?null:element(id)},location:{href:'https://example.netlify.app'+(dialogue?'/dialogue/':'/')},URL,AbortSignal,setTimeout,Option:function(label,value){this.label=label;this.value=value;},sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},fetch:async(url,options)=>{
  requests.push({url,...options});
  const body=JSON.parse(options.body);
  if(body.action==='catalog') return Response.json({enabled:true,models:[{id:'gemini',label:'Gemini',guestDefault:true,shortPrice:2,mediumPrice:2,shortOutput:2200,mediumOutput:2200}],balance:session?{welcome:100,purchased:0}:null});
  return Response.json({blocks:[],guestToken:'a'.repeat(64),requestId:'test-request'});
 }};
 vm.runInNewContext(code,context);
 return {context,element,requests,signIns,storage,get settings(){return settings;},setSession:value=>{session=value;},authChanged:()=>authListener('SIGNED_OUT')};
}
test('uses PKCE, keeps guest generation anonymous, and sends sign-in links to this site',async()=>{
 const b=browser();await tick();
 assert.equal(b.settings.options.auth.flowType,'pkce');
 assert.equal(b.element('model').disabled,true);
 assert.equal(b.requests[0].url,'/api/dialogue');
 assert.equal(b.requests[0].headers.Authorization,undefined);
 await b.element('sign-in-form').onsubmit({preventDefault(){}});
 assert.equal(b.signIns[0].email,'test@example.com');
 assert.equal(b.signIns[0].options.emailRedirectTo,'https://example.netlify.app/dialogue/');
 assert.match(b.element('account-status').textContent,/sign-in link/);
 await b.context.window.DialogueAccount.generate({length:'short'});
 assert.equal(JSON.parse(b.requests[1].body).quotedPrice,2);
 assert.equal(b.storage.get('rcg-dialogue-guest'),'a'.repeat(64));
});
test('signed-in sessions show usable credits and sign out returns to guest controls',async()=>{
 const b=browser({signedIn:true});await tick();
 assert.equal(b.requests[0].headers.Authorization,'Bearer user-token');
 assert.equal(b.element('account-label').textContent,'100 credits');
 assert.equal(b.element('account-balance').textContent,'Dialogue credits: 100');
 assert.equal(b.element('model').disabled,false);
 await b.element('sign-out').onclick();
 assert.equal(b.element('sign-in-form').hidden,false);
 assert.equal(b.element('model').disabled,true);
 assert.equal(b.element('account-balance').textContent,'');
});
test('Character Generator shares the Dialogue account without loading guest models',async()=>{
 const b=browser({signedIn:true,dialogue:false});await tick();
 assert.equal(b.element('account-label').textContent,'100 credits');
 assert.equal(b.context.window.DialogueAccount,undefined);
 await b.element('sign-out').onclick();
 assert.equal(b.element('account-label').textContent,'Sign in');
 assert.equal(b.requests.length,1);
 await b.element('sign-in-form').onsubmit({preventDefault(){}});
 assert.equal(b.signIns[0].options.emailRedirectTo,'https://example.netlify.app/dialogue/');
});
test('failed sign-in email remains retryable without displaying service errors',async()=>{
 const b=browser({sendError:{status:500,message:'internal secret'}});await tick();
 await b.element('sign-in-form').onsubmit({preventDefault(){}});
 assert.match(b.element('account-status').textContent,/Could not send/);
 assert.equal(b.element('send-link').disabled,false);
 assert.equal(b.element('account-status').textContent.includes('secret'),false);
});
test('invalid email input does not request a sign-in email',async()=>{
 const b=browser();await tick();
 b.element('account-email').value='bob';
 b.element('account-email').reportValidity=()=>false;
 await b.element('sign-in-form').onsubmit({preventDefault(){}});
 assert.equal(b.signIns.length,0);
 assert.equal(b.element('send-link').disabled,false);
});
test('proxy preserves the verified session and request ID without forwarding cookies',async t=>{
 const previous=process.env.DIALOGUE_SUPABASE_URL;
 process.env.DIALOGUE_SUPABASE_URL='https://example.supabase.co';
 t.after(()=>{if(previous===undefined)delete process.env.DIALOGUE_SUPABASE_URL;else process.env.DIALOGUE_SUPABASE_URL=previous;});
 const calls=t.mock.method(globalThis,'fetch',async(url,options)=>{
  assert.equal(url,'https://example.supabase.co/functions/v1/dialogue');
  assert.equal(options.headers.Authorization,'Bearer user-token');
  assert.equal(options.headers.Cookie,undefined);
  return Response.json({error:'Not enough credits.',requestId:'upstream-id'},{status:400,headers:{'X-Request-ID':'upstream-id'}});
 });
 const response=await proxy(new Request('https://preview.netlify.app/api/dialogue',{method:'POST',headers:{Origin:'https://preview.netlify.app',Authorization:'Bearer user-token',Cookie:'private=value'},body:'{"action":"catalog"}'}));
 assert.equal(response.status,400);
 assert.equal(response.headers.get('X-Request-ID'),'upstream-id');
 assert.equal((await response.json()).requestId,'upstream-id');
 assert.equal(calls.mock.callCount(),1);
 assert.equal((await proxy(new Request('https://preview.netlify.app/api/dialogue',{method:'POST',headers:{Origin:'https://evil.example'},body:'{}'}))).status,403);
 assert.equal(calls.mock.callCount(),1);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('../payments.js',import.meta.url),'utf8');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const user={user:{id:'buyer'},access_token:'token'};
const pack={id:'offer',amount:1000,currency:'USD',credits:100,terms:'One-time purchase. No expiry. Taxes calculated at checkout.'};
function browser({storage=new Map(),packEnabled=true,catalogUnavailable=false,scriptFails=false}={}) {
 const fields=new Map(),requests=[],opened=[],timers=new Map();
 let listener,session=user,status='pending',refreshes=0,initializations=0;
 const element=id=>{
  if(!fields.has(id))fields.set(id,{hidden:true,disabled:false,textContent:'',open:false,showModal(){this.open=true;},close(){this.open=false;}});
  return fields.get(id);
 };
 const window={Paddle:{Environment:{set:value=>assert.equal(value,'sandbox')},Initialize:options=>{listener=options.eventCallback;initializations++;},Checkout:{open:options=>opened.push(options)}}};
 const context={window,document:{getElementById:element,createElement:()=>({remove(){}}),head:{append:script=>queueMicrotask(()=>scriptFails?script.onerror():script.onload())}},
  localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
  Intl,AbortSignal,clearTimeout:id=>timers.delete(id),setTimeout:fn=>{timers.set(1,fn);return 1;},
  fetch:async(url,options)=>{
   requests.push({url,...options});const body=JSON.parse(options.body);
   assert.equal(options.headers.Authorization,'Bearer token');
   if(body.action==='catalog' && catalogUnavailable)return new Response('Function not found',{status:404});
   if(body.action==='catalog')return Response.json({pack:packEnabled?pack:null,environment:'sandbox',clientToken:'test_client'});
   if(body.action==='checkout')return Response.json({purchaseId:'purchase',transactionId:'transaction'});
   return Response.json({status});
  }
 };
 vm.runInNewContext(code,context);
 const payments=window.DialoguePayments({readSession:async()=>session,refresh:async()=>{refreshes++;}});
 return {payments,element,requests,opened,timers,storage,get refreshes(){return refreshes;},get initializations(){return initializations;},
  event:name=>listener({name}),setStatus:value=>status=value,setSession:value=>{session=value;payments.setSession(value);}};
}
test('guests and disabled offers never show a buy button',async()=>{
 const b=browser({packEnabled:false});b.setSession(null);await tick();assert.equal(b.requests.length,0);
 assert.equal(b.element('credit-pack-placeholder').hidden,true);
 b.setSession(user);await tick();assert.equal(b.element('credit-pack').hidden,true);
 assert.equal(b.element('credit-pack-placeholder').hidden,false);
 assert.equal(b.initializations,0);
});
test('a missing payment backend leaves the placeholder visible',async()=>{
 const b=browser({catalogUnavailable:true});b.setSession(user);await tick();
 assert.equal(b.element('credit-pack-placeholder').hidden,false);
 assert.equal(b.element('credit-pack').hidden,true);
 assert.equal(b.element('payment-status').textContent,'');
});
test('pack terms precede checkout and client completion cannot grant credits',async()=>{
 const b=browser();b.setSession(user);await tick();
 assert.equal(b.element('credit-pack').hidden,false);
 assert.equal(b.element('credit-pack-placeholder').hidden,true);
 assert.match(b.element('pack-price').textContent,/100 credits/);
 assert.equal(b.element('pack-terms').textContent,pack.terms);
 b.element('account-dialog').showModal();
 await b.element('buy-credits').onclick();
 assert.equal(b.element('account-dialog').open,false);
 assert.equal(b.opened[0].transactionId,'transaction');
 assert.equal(b.storage.get('dialogue-purchase-buyer'),'purchase');
 b.event('checkout.completed');await tick();
 assert.equal(b.refreshes,0);
 assert.match(b.element('payment-status').textContent,/not confirmed/);
 assert.equal(b.element('account-dialog').open,true);
 b.setStatus('fulfilled');await b.element('check-payment').onclick();await tick();
 assert.equal(b.refreshes,1);assert.equal(b.storage.has('dialogue-purchase-buyer'),false);
 assert.match(b.element('payment-status').textContent,/Credits added/);
});
test('pending payment survives reload and is isolated by account',async()=>{
 const b=browser({storage:new Map([['dialogue-purchase-buyer','purchase']])});
 b.setStatus('fulfilled');b.setSession(user);await tick();
 assert.equal(b.refreshes,1);
 assert.equal(b.element('check-payment').hidden,true);
 b.setSession(null);assert.equal(b.element('credit-pack').hidden,true);
 assert.equal(b.element('payment-status').textContent,'');
});
test('SDK failures recover without creating a payment or disabling later attempts',async()=>{
 const b=browser({scriptFails:true});b.setSession(user);await tick();
 await b.element('buy-credits').onclick();await tick();
 assert.equal(b.requests.some(r=>JSON.parse(r.body).action==='checkout'),false);
 assert.equal(b.element('buy-credits').disabled,false);
 assert.match(b.element('payment-status').textContent,/could not load/);
});
test('sign-out cancels polling and clears purchase details',async()=>{
 const b=browser();b.setSession(user);await tick();
 await b.element('buy-credits').onclick();b.event('checkout.closed');await tick();
 assert.equal(b.timers.size,1);
 b.setSession(null);assert.equal(b.timers.size,0);
 assert.equal(b.element('credit-pack-placeholder').hidden,true);
 assert.equal(b.element('credit-pack').hidden,true);assert.equal(b.element('check-payment').hidden,true);
});

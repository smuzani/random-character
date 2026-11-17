import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {createCheckoutService, createWebhookService, verifyPaddleSignature, createPaddleApi, transactionDetails, createPaymentRpc} from '../../supabase/functions/_shared/payments.mjs';
import proxy from '../netlify/functions/payments.mjs';
const id = (prefix, char='a') => `${prefix}_${char.repeat(26)}`;
const purchaseId = '00000000-0000-4000-8000-000000000001';
const pack = {id:purchaseId, amount:1000, currency:'USD', credits:100, terms:'One-time pack. No expiry. Taxes calculated at checkout.'};
const transaction = () => ({id:id('txn'), status:'completed', collection_mode:'automatic', currency_code:'USD', subscription_id:null, discount_id:null,
  custom_data:{purchase_id:purchaseId}, items:[{quantity:1, price:{id:id('pri'), billing_cycle:null, unit_price:{amount:'1000',currency_code:'USD'}}}], details:{totals:{total:'1060'}}});
const signed = (body, timestamp=Math.floor(Date.now()/1000), secret='test-secret') => `ts=${timestamp};h1=${createHmac('sha256', secret).update(`${timestamp}:${body}`).digest('hex')}`;
const req = (body, headers={}) => new Request('https://example.com/payments', {method:'POST',headers,body:typeof body==='string'?body:JSON.stringify(body)});
const event = () => ({event_id:id('evt'),event_type:'transaction.completed',occurred_at:'2020-01-01T00:00:00Z',data:transaction()});
const webhookRequest = (body=event()) => {const raw=JSON.stringify(body);return req(raw,{'Paddle-Signature':signed(raw)});};
function checkout(extra={}) {
  const calls=[];
  return {calls, handler:createCheckoutService({
    environment:'sandbox',clientToken:'test_client',enabled:true,allowedOrigin:'https://example.com',log:()=>{},
    authenticate:async()=>({id:purchaseId,email_confirmed_at:'2026-01-01',is_anonymous:false}),
    rpc:async(action,data)=>{calls.push({action,data});if(action==='catalog')return pack;if(action==='create')return {...pack,price_id:id('pri')};return {status:'pending'};},
    paddle:async(path,body)=>({...transaction(),status:'draft',custom_data:body.custom_data}), ...extra
  })};
}
test('signature verifies original bytes, rotations and timestamp tolerance',async()=>{
 const raw=JSON.stringify(event());
 assert.equal(await verifyPaddleSignature(raw,signed(raw),'test-secret'),true);
 assert.equal(await verifyPaddleSignature(raw+' ',signed(raw),'test-secret'),false);
 assert.equal(await verifyPaddleSignature(raw,signed(raw),'wrong'),false);
 assert.equal(await verifyPaddleSignature(raw,signed(raw,Math.floor(Date.now()/1000)-10),'test-secret'),false);
 assert.equal(await verifyPaddleSignature(raw,signed(raw,Math.floor(Date.now()/1000)+10),'test-secret'),false);
 assert.equal(await verifyPaddleSignature(raw,`${signed(raw)};h1=${'0'.repeat(64)}`,'test-secret'),true);
 assert.equal(await verifyPaddleSignature(raw,`${signed(raw)};ts=1`,'test-secret'),false);
});
test('checkout defaults closed and requires a verified, non-anonymous identity',async()=>{
 const {handler,calls}=checkout({enabled:false});
 assert.equal((await handler(req({action:'checkout',pack}))).status,401);
 assert.equal((await handler(req({action:'checkout',pack},{Authorization:'Bearer valid'}))).status,503);
 assert.equal((await (await handler(req({action:'catalog'},{Authorization:'Bearer valid'}))).json()).pack,null);
 assert.equal(calls.length,0);
 for(const user of [null,{id:purchaseId,is_anonymous:true,email_confirmed_at:'x'},{id:purchaseId}]) {
   const h=checkout({authenticate:async()=>user}).handler;
   assert.equal((await h(req({action:'checkout',pack},{Authorization:'Bearer invalid'}))).status,401);
 }
});
test('server creates and binds transaction from trusted quote, ignoring client identity and quantity',async()=>{
 const {handler,calls}=checkout();
 const response=await handler(req({action:'checkout',pack,userId:'victim',quantity:1000},{Authorization:'Bearer valid'}));
 assert.equal(response.status,200);
 const result=await response.json();
 assert.equal(calls[0].data.userId,purchaseId);
 assert.equal(calls[0].data.quantity,undefined);
 assert.equal(calls[1].action,'bind');
 assert.equal(calls[1].data.purchaseId,result.purchaseId);
 assert.equal(result.transactionId,id('txn'));
});
test('stale quotes and provider price mismatches never expose checkout or bind a transaction',async()=>{
 const stale=checkout({rpc:async()=>{throw {publicMessage:'The pack changed. Review the new terms.'};}}).handler;
 assert.equal((await stale(req({action:'checkout',pack},{Authorization:'Bearer valid'}))).status,400);
 const {handler,calls}=checkout({paddle:async(path,body)=>({...transaction(),currency_code:'EUR',custom_data:body.custom_data})});
 assert.equal((await handler(req({action:'checkout',pack},{Authorization:'Bearer valid'}))).status,503);
 assert.equal(calls.length,1);
});
test('status uses authenticated ownership and remains available with checkout disabled',async()=>{
 const {handler,calls}=checkout({enabled:false});
 assert.equal((await handler(req({action:'status',purchaseId},{Authorization:'Bearer valid'}))).status,200);
 assert.deepEqual(calls[0],{action:'status',data:{userId:purchaseId,purchaseId}});
});
test('a signed notification from a denied source cannot reach Paddle or the ledger', async () => {
 const handler = createWebhookService({
  environment: 'production',
  secret: 'test-secret',
  isAllowedSource: async () => false,
  paddle: async () => assert.fail('Paddle API was called'),
  rpc: async () => assert.fail('Ledger was called')
 });
 assert.equal((await handler(webhookRequest())).status, 403);
});

test('signed delayed completed events re-fetch payment and dispatch only verified details',async()=>{
 const calls=[];
 const handler=createWebhookService({environment:'sandbox',secret:'test-secret',log:()=>{},
  paddle:async path=>{assert.equal(path,`/transactions/${id('txn')}`);return transaction();},rpc:async(action,data)=>calls.push({action,data})});
 assert.equal((await handler(webhookRequest())).status,200);
 assert.equal(calls[0].action,'fulfill');
 assert.equal(calls[0].data.total,'1060');
 assert.equal(calls[0].data.purchaseId,purchaseId);
});
test('unpaid, invalid, altered and recurring payments cannot fulfill',async()=>{
 const calls=[];
 const handler=createWebhookService({environment:'sandbox',secret:'test-secret',log:()=>{},paddle:async()=>({...transaction(),status:'paid'}),rpc:async(...args)=>calls.push(args)});
 assert.equal((await handler(req(event(),{'Paddle-Signature':'ts=1;h1=bad'}))).status,401);
 assert.equal((await handler(webhookRequest({...event(),data:{...transaction(),status:'draft'}}))).status,400);
 assert.equal((await handler(webhookRequest())).status,503);
 assert.equal((await handler(webhookRequest({...event(),event_type:'transaction.paid'}))).status,200);
 assert.equal(calls.length,0);
 for(const mutate of [t=>t.items[0].quantity=11,t=>t.items[0].price.billing_cycle={interval:'month'},t=>t.discount_id=id('dsc'),t=>t.custom_data.purchase_id='forged',t=>t.items=[]]) {
  const tx=transaction();mutate(tx);assert.throws(()=>transactionDetails(tx));
 }
});
test('database outages return retryable failures without leaking provider or database errors',async()=>{
 const handler=createWebhookService({environment:'sandbox',secret:'test-secret',log:()=>{},paddle:async()=>transaction(),rpc:async()=>{throw new Error('private database error');}});
 const response=await handler(webhookRequest());
 assert.equal(response.status,503);
 assert.equal((await response.text()).includes('private'),false);
});
test('approved adjustments created or updated place a hold; pending refunds do not',async()=>{
 const calls=[];
 let status='approved';
 const handler=createWebhookService({environment:'sandbox',secret:'test-secret',log:()=>{},paddle:async()=>({id:id('adj'),transaction_id:id('txn'),action:'refund',status}),rpc:async(action,data)=>calls.push({action,data})});
 for(const event_type of ['adjustment.created','adjustment.updated']) {
  assert.equal((await handler(webhookRequest({...event(),event_type,data:{id:id('adj')}}))).status,200);
 }
 assert.equal(calls.length,2);assert.ok(calls.every(c=>c.action==='hold'));
 status='pending_approval';
 await handler(webhookRequest({...event(),event_type:'adjustment.created',data:{id:id('adj')}}));
 assert.equal(calls.length,2);
});
test('Paddle adapter uses the selected environment and keeps secrets server-side',async()=>{
 const api=createPaddleApi({environment:'sandbox',apiKey:'secret',fetcher:async(url,options)=>{
  assert.equal(url,'https://sandbox-api.paddle.com/transactions');assert.equal(options.headers.Authorization,'Bearer secret');
  return Response.json({data:{id:'result'}});
 }});
 assert.equal((await api('/transactions',{})).id,'result');
 await assert.rejects(createPaddleApi({environment:'typo',apiKey:'secret'})('/transactions'));
 const rpc=createPaymentRpc('https://example.supabase.co','service',async(url,options)=>{
  assert.ok(url.endsWith('/dialogue_payments'));assert.equal(options.headers.Authorization,'Bearer service');
  return Response.json({message:'sensitive'},{status:400});
 });
 await assert.rejects(rpc('catalog'),error=>!error.publicMessage && !error.message.includes('sensitive'));
});
test('payment proxy routes only to payment service and refuses cross-origin requests',async t=>{
 const previous=process.env.DIALOGUE_SUPABASE_URL;
 process.env.DIALOGUE_SUPABASE_URL='https://example.supabase.co';
 t.after(()=>{if(previous===undefined)delete process.env.DIALOGUE_SUPABASE_URL;else process.env.DIALOGUE_SUPABASE_URL=previous;});
 t.mock.method(globalThis,'fetch',async(url,options)=>{
  assert.equal(url,'https://example.supabase.co/functions/v1/dialogue-payments');
  assert.equal(options.headers.Authorization,'Bearer valid');return Response.json({pack});
 });
 assert.equal((await proxy(req({action:'catalog'},{Authorization:'Bearer valid',Origin:'https://example.com'}))).status,200);
 assert.equal((await proxy(req({}, {Origin:'https://evil.com'}))).status,403);
});

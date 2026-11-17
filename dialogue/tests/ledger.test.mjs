import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile);
const database=process.env.DIALOGUE_TEST_DATABASE;
const args=['-X','-qAt','-v','ON_ERROR_STOP=1','-d',database || ''];
function sql(query) {return execFileSync('psql',[...args,'-c',query],{encoding:'utf8'}).trim();}
const uid='00000000-0000-4000-8000-000000000001';
function rpc(action,data={}) {return `select public.dialogue_service('${action}','${JSON.stringify(data)}'::jsonb)`;}
const reset=()=>sql(`truncate dialogue.payment_events, dialogue.payment_holds, dialogue.purchases; truncate dialogue.attempts, dialogue.requests, dialogue.guests, dialogue.accounts, dialogue.months; update dialogue.settings set enabled=true,monthly_cap=1000000,guest_allocation=500000,welcome_allocation=500000,welcome_credits=0,welcome_cost=0;`);
const begin=(requestId,extra={})=>rpc('begin',{requestId,model:'test-model',length:'short',quotedPrice:7,userId:uid,...extra});
test('PostgreSQL ledger: reservations, races, grants, pools, recovery and permissions',{skip:!database},async t=>{
 sql(`insert into auth.users(id,email_confirmed_at) values('${uid}',now()) on conflict do nothing;
 insert into dialogue.models(id,label,enabled,guest_default,input_rate,output_rate,short_price,medium_price,short_output,medium_output) values('test-model','Test',true,true,1000000,1000000,7,10,1000,2000) on conflict do nothing;`);
 await t.test('guest balance reads existing sessions and is restricted to the service role',()=>{
  reset();
  sql("insert into dialogue.guests(token_hash,used) values ('returning',1),('exhausted',10)");
  assert.equal(sql("set role service_role; select public.dialogue_guest_remaining(null), public.dialogue_guest_remaining('unknown'), public.dialogue_guest_remaining('returning'), public.dialogue_guest_remaining('exhausted')"),'10|10|9|0');
  assert.equal(sql("select has_function_privilege('anon','public.dialogue_guest_remaining(text)','execute'), has_function_privilege('authenticated','public.dialogue_guest_remaining(text)','execute')"),'f|f');
 });
 await t.test('simultaneous requests cannot overspend and repeated failure refunds once',async()=>{
  reset();sql(`insert into dialogue.accounts(user_id,welcome,purchased) values('${uid}',5,5)`);
  const ids=[crypto.randomUUID(),crypto.randomUUID()];
  const results=await Promise.allSettled(ids.map(id=>run('psql',[...args,'-c',begin(id)])));
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  assert.equal(sql(`select welcome||','||purchased from dialogue.accounts`),'0,3');
  const id=ids[results.findIndex(r=>r.status==='fulfilled')];
  sql(rpc('finish',{requestId:id,success:false}));sql(rpc('finish',{requestId:id,success:false}));
  assert.equal(sql(`select welcome||','||purchased from dialogue.accounts`),'5,5');
 });
 await t.test('success requires validation and consumes the reservation exactly once',()=>{
  reset();sql(`insert into dialogue.accounts(user_id,welcome,purchased) values('${uid}',5,5)`);
  const requestId=crypto.randomUUID();sql(begin(requestId));
  assert.throws(()=>sql(rpc('finish',{requestId,success:true})));
  sql(rpc('reserve_call',{requestId,attempt:0}));
  sql(rpc('record_attempt',{requestId,attempt:0,validation:'passed',inputTokens:20,outputTokens:10,providerStatus:200,finishReason:'STOP',elapsedMs:10}));
  sql(rpc('finish',{requestId,success:true}));sql(rpc('finish',{requestId,success:false}));
  assert.equal(sql(`select welcome||','||purchased from dialogue.accounts`),'0,3');
  assert.equal(sql(`select actual_cost from dialogue.attempts`),'30');
 });
 await t.test('new sessions and retries compete for the same guest pool',async()=>{
  reset();sql('update dialogue.settings set guest_allocation=42000,welcome_allocation=0,monthly_cap=42000');
  const ids=[crypto.randomUUID(),crypto.randomUUID(),crypto.randomUUID()];
  ids.forEach((id,i)=>sql(begin(id,{userId:null,guestHash:String(i).repeat(64)})));
  const results=await Promise.allSettled(ids.map(requestId=>run('psql',[...args,'-c',rpc('reserve_call',{requestId,attempt:0})])));
  assert.equal(results.filter(r=>r.status==='fulfilled').length,2);
  const requestId=ids[results.findIndex(r=>r.status==='fulfilled')];
  assert.throws(()=>sql(rpc('reserve_call',{requestId,attempt:1})));
  assert.equal(sql('select guest_spent from dialogue.months'),'42000');
 });
 await t.test('ten requests per guest session and signed-in model selection',()=>{
  reset();
  for(let i=0;i<10;i++) sql(begin(crypto.randomUUID(),{userId:null,guestHash:'a'.repeat(64)}));
  assert.throws(()=>sql(begin(crypto.randomUUID(),{userId:null,guestHash:'a'.repeat(64)})));
  sql("update dialogue.models set guest_default=false where id='test-model'");
  assert.throws(()=>sql(begin(crypto.randomUUID(),{userId:null,guestHash:'b'.repeat(64)})));
  sql("update dialogue.models set guest_default=true where id='test-model'");
 });
 await t.test('welcome grants count at grant time and occur once',async()=>{
  reset();sql('update dialogue.settings set welcome_credits=5,welcome_cost=50000');
  await Promise.all([run('psql',[...args,'-c',rpc('account',{userId:uid})]),run('psql',[...args,'-c',rpc('account',{userId:uid})])]);
  assert.equal(sql('select welcome from dialogue.accounts'),'5');
  assert.equal(sql('select welcome_spent from dialogue.months'),'50000');
 });
 await t.test('pool exhaustion prevents welcome grants',()=>{
  reset();sql('update dialogue.settings set welcome_credits=5,welcome_cost=50000,welcome_allocation=49999');
  sql(rpc('account',{userId:uid}));assert.equal(sql('select welcome from dialogue.accounts'),'0');
 });
 await t.test('stale reservations return credits and cannot succeed later',()=>{
  reset();sql(`insert into dialogue.accounts(user_id,welcome,purchased) values('${uid}',5,5)`);
  const requestId=crypto.randomUUID();sql(begin(requestId));
  sql("update dialogue.requests set created_at=now()-interval '11 minutes'");sql(rpc('reconcile'));
  assert.equal(sql('select welcome||\',\'||purchased from dialogue.accounts'),'5,5');
  assert.equal(JSON.parse(sql(rpc('finish',{requestId,success:true}))).status,'failed');
 });
 await t.test('stale quotes and underfunded scene prices cannot reserve credits',()=>{
  reset();sql(`insert into dialogue.accounts(user_id,welcome,purchased) values('${uid}',10,0)`);
  assert.throws(()=>sql(begin(crypto.randomUUID(),{quotedPrice:6})));
  sql("update dialogue.models set short_price=1 where id='test-model'");
  assert.throws(()=>sql(begin(crypto.randomUUID(),{quotedPrice:1})));
  assert.equal(sql('select welcome from dialogue.accounts'),'10');
  sql("update dialogue.models set short_price=7 where id='test-model'");
 });
 await t.test('in-flight requests retain their original rates and output ceiling',()=>{
  reset();const requestId=crypto.randomUUID();sql(begin(requestId,{userId:null,guestHash:'c'.repeat(64)}));
  sql("update dialogue.models set input_rate=2000000,short_output=2000 where id='test-model'");
  sql(rpc('reserve_call',{requestId,attempt:0}));
  assert.equal(sql('select reserved_cost from dialogue.attempts'),'21000');
  sql("update dialogue.models set input_rate=1000000,short_output=1000 where id='test-model'");
 });
 await t.test('browser roles cannot call billing operations or read balances',()=>{
  for(const role of ['anon','authenticated']) {
   assert.throws(()=>sql(`set role ${role}; ${rpc('account',{userId:uid})}`));
   assert.throws(()=>sql(`set role ${role}; select * from dialogue.accounts`));
  }
 });
});

test('PostgreSQL payments: atomic grants, ownership, retries and holds',{skip:!database},async t=>{
 const payment=(action,data={})=>`select public.dialogue_payments('${action}','${JSON.stringify(data)}'::jsonb)`;
 const packId='00000000-0000-4000-8000-000000000023';
 const priceId='pri_'+ 'a'.repeat(26), transactionId='txn_'+ 'b'.repeat(26);
 const terms='One-time credits. No expiry. Taxes calculated at checkout.';
 const quote={packId,userId:uid,environment:'sandbox',amount:1000,currency:'USD',credits:100,terms};
 const resetPayments=()=>{
  sql('truncate dialogue.payment_events, dialogue.payment_holds, dialogue.purchases, dialogue.credit_packs');
  reset();
  sql(`insert into dialogue.credit_packs(id,enabled,environment,price_id,amount,currency,credits,terms) values('${packId}',true,'sandbox','${priceId}',1000,'USD',100,'${terms}')`);
 };
 const create=(extra={})=>{
  const purchaseId=crypto.randomUUID();
  sql(payment('create',{...quote,purchaseId,...extra}));
  sql(payment('bind',{purchaseId,transactionId}));
  return purchaseId;
 };
 const complete=(purchaseId,extra={})=>payment('fulfill',{purchaseId,transactionId,eventId:'evt_'+ 'c'.repeat(26),environment:'sandbox',status:'completed',priceId,amount:1000,currency:'USD',quantity:1,total:1060,...extra});
 await t.test('concurrent duplicate events and different events for one purchase grant once',async()=>{
  resetPayments();const purchaseId=create();
  await Promise.all(Array.from({length:8},(_,i)=>run('psql',[...args,'-c',complete(purchaseId,{eventId:'evt_'+String(i%2).repeat(26)})])));
  assert.equal(sql(`select purchased from dialogue.accounts where user_id='${uid}'`),'100');
  assert.equal(sql('select count(*) from dialogue.payment_events'),'2');
  assert.equal(JSON.parse(sql(payment('status',{purchaseId,userId:uid}))).status,'fulfilled');
 });
 await t.test('multiple paid packs grant 100 credits per unit and reject underpayment',()=>{
  resetPayments();const purchaseId=create();
  assert.throws(()=>sql(complete(purchaseId,{quantity:10,total:1000})));
  sql(complete(purchaseId,{quantity:10,total:10000}));
  sql(complete(purchaseId,{quantity:10,total:10000}));
  assert.equal(sql('select purchased from dialogue.accounts'),'1000');
  assert.equal(sql('select fulfilled_quantity from dialogue.purchases'),'10');
 });
 await t.test('stale quotes, unverified identities and browser roles cannot create purchases',()=>{
  resetPayments();
  for(const extra of [{credits:10000},{currency:'EUR'},{amount:1},{terms:'altered'},{environment:'production'},{userId:crypto.randomUUID()}]) {
   assert.throws(()=>sql(payment('create',{...quote,purchaseId:crypto.randomUUID(),...extra})));
  }
  for(const role of ['anon','authenticated']) {
   assert.throws(()=>sql(`set role ${role}; ${payment('catalog',{environment:'sandbox'})}`));
   assert.throws(()=>sql(`set role ${role}; select * from dialogue.purchases`));
  }
  assert.equal(sql("select has_function_privilege('service_role','public.dialogue_payments(text,jsonb)','execute')"),'t');
  assert.equal(sql("select has_function_privilege('anon','public.dialogue_service(text,jsonb)','execute'), has_function_privilege('authenticated','public.dialogue_service(text,jsonb)','execute')"),'f|f');
  assert.equal(sql("select bool_and(relrowsecurity) from pg_class where oid in ('dialogue.purchases'::regclass,'dialogue.credit_packs'::regclass,'dialogue.payment_events'::regclass,'dialogue.payment_holds'::regclass)"),'t');
 });
 await t.test('invalid and unpaid payments roll back both event receipt and grant',()=>{
  resetPayments();const purchaseId=create();
  for(const extra of [{status:'paid'},{priceId:'pri_'+ 'x'.repeat(26)},{currency:'EUR'},{amount:999},{quantity:11},{purchaseId:crypto.randomUUID()},{total:999},{total:null},{environment:'production'}]) {
   assert.throws(()=>sql(complete(purchaseId,extra)));
  }
  assert.equal(sql('select count(*) from dialogue.payment_events'),'0');
  assert.equal(sql('select purchased from dialogue.accounts'),'0');
  sql(complete(purchaseId));assert.equal(sql('select purchased from dialogue.accounts'),'100');
 });
 await t.test('delayed events retain purchased terms after offer edits or disablement',()=>{
  resetPayments();const purchaseId=create();
  sql("update dialogue.credit_packs set enabled=false,credits=200,amount=2000");
  sql(complete(purchaseId));assert.equal(sql('select purchased from dialogue.accounts'),'100');
  const otherId=crypto.randomUUID();
  sql(`insert into auth.users(id,email_confirmed_at) values('${otherId}',now())`);
  assert.throws(()=>sql(payment('status',{purchaseId,userId:otherId})));
  assert.throws(()=>sql(payment('bind',{purchaseId,transactionId:'txn_'+ 'x'.repeat(26)})));
 });
 await t.test('purchased credits fund generation only after welcome credits',()=>{
  resetPayments();const purchaseId=create();sql(complete(purchaseId));
  sql('update dialogue.accounts set welcome=5');
  const requestId=crypto.randomUUID();sql(begin(requestId));
  assert.equal(sql('select welcome||\',\'||purchased from dialogue.accounts'),'0,98');
  sql(rpc('finish',{requestId,success:false}));
  assert.equal(sql('select welcome||\',\'||purchased from dialogue.accounts'),'5,100');
 });
 await t.test('refund before fulfillment holds the account despite delayed payment',()=>{
  resetPayments();const purchaseId=create();
  sql(payment('hold',{transactionId,environment:'sandbox',eventId:'evt_'+ 'd'.repeat(26),reason:'refund'}));
  sql(complete(purchaseId));
  assert.equal(JSON.parse(sql(payment('status',{purchaseId,userId:uid}))).status,'review');
  assert.throws(()=>sql(begin(crypto.randomUUID())));
  assert.throws(()=>sql(payment('create',{...quote,purchaseId:crypto.randomUUID()})));
  assert.equal(sql('select purchased from dialogue.accounts'),'100');
 });
 await t.test('refund after reservation still blocks spending credits returned by a failed request',()=>{
  resetPayments();const purchaseId=create();sql(complete(purchaseId));
  const requestId=crypto.randomUUID();sql(begin(requestId));
  sql(payment('hold',{transactionId,environment:'sandbox',eventId:'evt_'+ 'e'.repeat(26),reason:'chargeback'}));
  sql(rpc('finish',{requestId,success:false}));
  assert.equal(sql('select purchased from dialogue.accounts'),'100');
  assert.throws(()=>sql(begin(crypto.randomUUID())));
 });
 await t.test('missing accounts cannot leave a fulfilled purchase without a credit grant',()=>{
  resetPayments();const purchaseId=create();sql('delete from dialogue.accounts');
  assert.throws(()=>sql(complete(purchaseId)));
  assert.equal(sql('select count(*) from dialogue.payment_events'),'0');
  assert.equal(sql('select count(*) from dialogue.purchases where fulfilled_at is not null'),'0');
 });
 await t.test('a grant failure rolls back receipt so a retry can fulfill',()=>{
  resetPayments();const purchaseId=create();
  sql(`update dialogue.accounts set purchased=9223372036854775800 where user_id='${uid}'`);
  assert.throws(()=>sql(complete(purchaseId)));
  assert.equal(sql('select count(*) from dialogue.payment_events'),'0');
  assert.equal(sql('select count(*) from dialogue.purchases where fulfilled_at is not null'),'0');
  sql('update dialogue.accounts set purchased=0');sql(complete(purchaseId));
  assert.equal(sql('select purchased from dialogue.accounts'),'100');
 });
 resetPayments();
});

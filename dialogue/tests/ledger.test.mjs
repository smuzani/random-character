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
const reset=()=>sql(`truncate dialogue.attempts, dialogue.requests, dialogue.guests, dialogue.accounts, dialogue.months; update dialogue.settings set enabled=true,monthly_cap=1000000,guest_allocation=500000,welcome_allocation=500000,welcome_credits=0,welcome_cost=0;`);
const begin=(requestId,extra={})=>rpc('begin',{requestId,model:'test-model',length:'short',quotedPrice:7,userId:uid,...extra});
test('PostgreSQL ledger: reservations, races, grants, pools, recovery and permissions',{skip:!database},async t=>{
 sql(`insert into auth.users(id,email_confirmed_at) values('${uid}',now()) on conflict do nothing;
 insert into dialogue.models(id,label,enabled,guest_default,input_rate,output_rate,short_price,medium_price,short_output,medium_output) values('test-model','Test',true,true,1000000,1000000,7,10,1000,2000) on conflict do nothing;`);
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

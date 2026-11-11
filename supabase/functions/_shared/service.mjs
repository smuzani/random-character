import {generateScene, validate, GenerationError} from './generation.mjs';

const encode = new TextEncoder();
export async function hashGuest(token) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', encode.encode(token)))].map(b => b.toString(16).padStart(2,'0')).join('');
}

// Dependencies keep the HTTP adapter testable without the Edge runtime.
export function createService({rpc, authenticate, key, allowedOrigin, log = entry => console.log(JSON.stringify(entry)), generate = generateScene}) {
  return async request => {
    const requestId = crypto.randomUUID();
    const started = Date.now();
    const headers = {'Cache-Control':'no-store', 'X-Request-ID':requestId, 'Access-Control-Allow-Origin':allowedOrigin,
      'Access-Control-Allow-Headers':'authorization, apikey, content-type', 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Vary':'Origin'};
    const reply = (body,status=200) => {
      log({event:'dialogue_request',requestId,status:status < 400 ? 'succeeded' : 'failed',httpStatus:status,elapsedMs:Date.now()-started});
      return Response.json({...body,requestId},{status,headers});
    };
    let reserved = false;
    let guestToken;
    try {
      if (request.headers.get('origin') && request.headers.get('origin') !== allowedOrigin) return reply({error:'Use the Dialogue site.'},403);
      if(request.method==='OPTIONS') return new Response(null,{status:204,headers});
      if(request.method!=='POST') return reply({error:'Use POST.'},405);
      const raw = await request.text();
      if(encode.encode(raw).length>12000) return reply({error:'Scene setup is too long.'},413);
      let input;
      try { input=JSON.parse(raw); } catch { return reply({error:'Send a valid request.'},400); }
      if(!input || typeof input!=='object') return reply({error:'Send a valid request.'},400);
      // Invalid or expired supplied credentials must never silently become a guest.
      const user = request.headers.has('authorization') ? await authenticate(request.headers.get('authorization')) : null;
      if(request.headers.has('authorization') && (!user || user.is_anonymous)) return reply({error:'Sign in again.'},401);
      const userId = user?.id;
      const action = input.action || 'generate';
      if(action==='catalog') {
        const catalog = await rpc('catalog');
        const balance = userId ? await rpc('account',{userId}) : null;
        return reply({...catalog,balance});
      }
      if(action!=='generate') return reply({error:'Unknown action.'},400);
      let scene;
      try {scene=validate(input);} catch(error) {return reply({error:error.message},400);}
      if(!key) return reply({error:'Generation is unavailable.'},503);
      if(userId) await rpc('account',{userId});
      else {
        guestToken = typeof input.guestToken==='string' && /^[a-f0-9]{64}$/.test(input.guestToken)
          ? input.guestToken : [...crypto.getRandomValues(new Uint8Array(32))].map(b=>b.toString(16).padStart(2,'0')).join('');
      }
      const catalog = await rpc('catalog');
      const model = input.model || catalog.models.find(m=>m.guestDefault)?.id;
      const quote = await rpc('begin',{requestId,userId,guestHash:guestToken && await hashGuest(guestToken),model,length:scene.length,quotedPrice:input.quotedPrice});
      reserved = true;
      const result = await generate(scene,{
        key,model,maxOutputTokens:quote.maxOutputTokens,
        beforeCall:attempt=>rpc('reserve_call',{requestId,attempt}),
        onAttempt:async trace=>{
          // Only a fixed metadata schema is logged. Never log exceptions or provider bodies.
          log({event:'dialogue_attempt',requestId,...trace});
          await rpc('record_attempt',{requestId,...trace});
        }
      });
      const settlement=await rpc('finish',{requestId,success:true});
      if(settlement.status!=='succeeded') throw new Error('Request settlement failed.');
      reserved=false;
      return reply({...result,guestToken});
    } catch(error) {
      if(reserved) {
        try {await rpc('finish',{requestId,success:false});}
        catch {log({event:'dialogue_settlement_pending',requestId});}
      }
      const safe = error instanceof GenerationError || error.publicMessage;
      return reply({error:safe ? (error.publicMessage || error.message) : 'The request failed. Try again.',guestToken},safe ? error.status || 400 : 503);
    }
  };
}

const publicErrors = new Set([
  'Sign in first.','Verify your email first.','Generation is unavailable.','Choose an available model.',
  'Choose a valid scene length.','Choose an available length.','Sign in to select this model.',
  'Guest limit reached. Sign in to continue.','The price changed. Review the new price.','Not enough credits.',
  'Guest generation is unavailable. Sign in to continue.'
]);
export function createRpc(url, serviceKey, fetcher=fetch) {
  return async (action,data={}) => {
    const response=await fetcher(`${url}/rest/v1/rpc/dialogue_service`,{
      method:'POST',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({p_action:action,p_data:data}),signal:AbortSignal.timeout(10000)
    });
    const body=await response.json();
    if(!response.ok) {
      const error=new Error('Database operation failed.');
      if(publicErrors.has(body.message)) error.publicMessage=body.message;
      throw error;
    }
    return body;
  };
}

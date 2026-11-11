import {createService, createRpc} from '../_shared/service.mjs';
const url=Deno.env.get('SUPABASE_URL')!;
const serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const origin=Deno.env.get('DIALOGUE_ORIGIN') || 'https://random-dialogue-muzani.netlify.app';
Deno.serve(createService({
  rpc:createRpc(url,serviceKey), key:Deno.env.get('GEMINI_API_KEY'), allowedOrigin:origin,
  authenticate:async (authorization:string)=>{
    const response=await fetch(`${url}/auth/v1/user`,{headers:{apikey:serviceKey,Authorization:authorization},signal:AbortSignal.timeout(10000)});
    return response.ok ? response.json() : null;
  }
}));

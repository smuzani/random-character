import {validate, parseScene, generateScene} from '../../../supabase/functions/_shared/generation.mjs';
export {validate, parseScene};
const reply = (body,status=200) => Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export default async function handler(req){
  if(req.method!=='POST')return reply({error:'Use POST to generate a scene.'},405);
  const origin=req.headers.get('origin');
  if(origin&&origin!==new URL(req.url).origin)return reply({error:'Generate from this site.'},403);
  let scene;
  try{const raw=await req.text();if(raw.length>12000)return reply({error:'Scene setup is too long.'},413);scene=validate(JSON.parse(raw));}catch(error){return reply({error:error instanceof SyntaxError?'Send a valid scene setup.':error.message},400);}
  if(process.env.DIALOGUE_BACKEND==='supabase') {
    const url=process.env.DIALOGUE_SUPABASE_URL;
    if(!url) return reply({error:'Generation is unavailable.'},503);
    // Legacy clients share the same guest pool; rollback never bypasses accounting.
    return fetch(`${url}/functions/v1/dialogue`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(scene)});
  }
  const key=process.env.GEMINI_API_KEY;
  if(!key)return reply({error:'AI is not connected yet. Add GEMINI_API_KEY in this site’s Netlify environment variables, then redeploy.'},503);
  try { return reply(await generateScene(scene, {key})); }
  catch (error) { return reply({error:error.message}, error.status || 502); }
}
export const config={path:'/api/generate',rateLimit:{windowLimit:5,windowSize:60,aggregateBy:['ip','domain']}};

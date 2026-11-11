const reply=(body,status)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});

// Keep browser requests on the site's origin, including Netlify deploy previews.
// Supabase still validates identities and owns all spending decisions.
export default async function handler(request) {
  const requestId=crypto.randomUUID();
  if(request.method!=='POST') return reply({error:'Use POST.',requestId},405);
  const origin=request.headers.get('origin');
  if(origin && origin!==new URL(request.url).origin) return reply({error:'Use the Dialogue site.',requestId},403);
  const url=process.env.DIALOGUE_SUPABASE_URL;
  if(!url || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) return reply({error:'Sign-in and generation are unavailable.',requestId},503);
  const raw=await request.text();
  if(new TextEncoder().encode(raw).length>12000) return reply({error:'Scene setup is too long.',requestId},413);
  const headers={'Content-Type':'application/json'};
  const authorization=request.headers.get('authorization');
  if(authorization) headers.Authorization=authorization;
  try {
    const response=await fetch(`${url}/functions/v1/dialogue`,{method:'POST',headers,body:raw,signal:AbortSignal.timeout(55000)});
    return new Response(response.body,{status:response.status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Request-ID':response.headers.get('X-Request-ID') || requestId}});
  } catch {
    console.error(JSON.stringify({event:'dialogue_proxy_failed',requestId}));
    return reply({error:'The request could not reach the generation service. Please try again.',requestId},503);
  }
}
export const config={path:'/api/dialogue',rateLimit:{windowLimit:20,windowSize:60,aggregateBy:['ip','domain']}};

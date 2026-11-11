(() => {
  const config=window.DIALOGUE_CONFIG || {};
  if(!config.url || !config.key) return;
  const $=id=>document.getElementById(id);
  const client=window.supabase.createClient(config.url,config.key,{
    auth:{flowType:'pkce',storageKey:'rcg-auth-session-v1',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}
  });
  let session=null, catalog=null, loadVersion=0;
  async function token() {
    const {data,error}=await client.auth.getSession();
    if(error) throw new Error('The sign-in link expired or could not be verified. Request a new link in this browser.');
    session=data.session;
    return session?.access_token;
  }
  async function call(body) {
    const accessToken=await token();
    const response=await fetch('/api/dialogue',{method:'POST',headers:{apikey:config.key,'Content-Type':'application/json',...(accessToken?{Authorization:`Bearer ${accessToken}`}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(120000)});
    const data=await response.json();
    if(data.guestToken) try {sessionStorage.setItem('rcg-dialogue-guest',data.guestToken);}catch {}
    if(!response.ok) throw new Error((data.error || 'The request failed.')+(data.requestId?` Request ID: ${data.requestId}`:''));
    return data;
  }
  function price() {
    const model=catalog?.models.find(m=>m.id===$('model').value);
    const amount=model?.[$('length').value+'Price'];
    $('scene-price').textContent=model ? (session ? `${amount} credits per scene` : 'Guest generation: up to 10 scenes per session') : 'Generation is unavailable.';
    $('model').disabled=!session;
    $('sign-out').hidden=!session;
    $('sign-in-form').hidden=!!session;
    $('account-balance').textContent=catalog?.balance ? `Credits: ${catalog.balance.welcome + catalog.balance.purchased}` : '';
    $('open-account').textContent=session ? 'Account' : 'Sign in';
    $('medium-length').disabled=!model?.mediumPrice || !model?.mediumOutput;
    if($('medium-length').disabled && $('length').value==='medium') {$('length').value='short';price();}
  }
  async function load() {
    const version=++loadVersion;
    const next=await call({action:'catalog'});
    if(version!==loadVersion) return;
    catalog=next;
    const selected=$('model').value;
    $('model').replaceChildren(...catalog.models.map(model=>{
      const label = model.id === 'gemini-3.1-flash-lite' ? 'Paper Sparrow' : model.label;
      return new Option(label, model.id);
    }));
    $('model').value=catalog.models.some(m=>m.id===selected) && session ? selected : catalog.models.find(m=>m.guestDefault)?.id || catalog.models[0]?.id || '';
    price();
  }
  window.DialogueAccount={
    async generate(payload) {
      if(!catalog?.enabled) throw new Error('Generation is unavailable.');
      const model=catalog.models.find(m=>m.id===$('model').value);
      let guestToken;try {guestToken=sessionStorage.getItem('rcg-dialogue-guest');}catch {}
      const result=await call({...payload,model:model?.id,quotedPrice:model?.[payload.length+'Price'],guestToken});
      load().catch(()=>{});
      return result;
    }
  };
  $('account-controls').hidden=false;
  $('open-account').onclick=()=>$('account-dialog').showModal();
  $('model').onchange=price;
  $('length').addEventListener('change',price);
  $('sign-in-form').onsubmit=async event=>{
    event.preventDefault();
    if(!$('account-email').reportValidity()) return;
    $('send-link').disabled=true;
    try {
      const {error}=await client.auth.signInWithOtp({
        email:$('account-email').value.trim(),
        options:{emailRedirectTo:new URL('./',location.href).href}
      });
      if(error) throw new Error(error.status===429 ? 'Too many sign-in requests. Wait a minute and try again.' : 'Could not send the sign-in email. Please try again later.');
      $('account-status').textContent='Check your email for a sign-in link. Open it in this browser.';
    } catch(error) {$('account-status').textContent=error.message;}
    finally {$('send-link').disabled=false;}
  };
  $('sign-out').onclick=async()=>{
    $('sign-out').disabled=true;
    try {
      const {error}=await client.auth.signOut();
      if(error) throw new Error('Could not sign out. Please try again.');
      await load();
      $('account-status').textContent='Signed out.';
    } catch(error) {$('account-status').textContent=error.message;}
    finally {$('sign-out').disabled=false;}
  };
  // Defer API work until the SDK releases its auth-state lock.
  client.auth.onAuthStateChange((event)=>{
    if(['SIGNED_IN','SIGNED_OUT','TOKEN_REFRESHED'].includes(event)) {
      setTimeout(()=>load().catch(error=>{$('status').textContent=error.message;}),0);
    }
  });
  load().catch(error=>{$('status').textContent=error.message;});
})();

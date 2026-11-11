(() => {
  const config=window.DIALOGUE_CONFIG || {};
  if(!config.url || !config.key) return;
  const $=id=>document.getElementById(id);
  const modelSelect=$('model');
  const client=window.supabase.createClient(config.url,config.key,{
    auth:{flowType:'pkce',storageKey:'rcg-auth-session-v1',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}
  });
  let session=null, catalog=null, loadVersion=0;
  async function readSession() {
    const {data,error}=await client.auth.getSession();
    if(error) throw new Error('The sign-in link expired or could not be verified. Request a new link in this browser.');
    return data.session;
  }
  async function call(body, accessToken) {
    const response=await fetch('/api/dialogue',{method:'POST',headers:{apikey:config.key,'Content-Type':'application/json',...(accessToken?{Authorization:`Bearer ${accessToken}`}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(120000)});
    const data=await response.json();
    if(data.guestToken) try {sessionStorage.setItem('rcg-dialogue-guest',data.guestToken);}catch {}
    if(!response.ok) throw new Error((data.error || 'The request failed.')+(data.requestId?` Request ID: ${data.requestId}`:''));
    return data;
  }
  function renderAccount() {
    const balance=session && catalog?.balance;
    const credits=balance ? balance.welcome + balance.purchased : null;
    const label=credits===null ? 'Account' : `${credits.toLocaleString()} ${credits===1 ? 'credit' : 'credits'}`;
    $('account-label').textContent=session ? label : 'Sign in';
    $('open-account').setAttribute('aria-label', credits===null ? $('account-label').textContent : `Account: ${label}`);
    $('open-account').hidden=false;
    $('sign-out').hidden=!session;
    $('sign-in-form').hidden=!!session;
    $('account-balance').textContent=credits===null ? '' : `Dialogue credits: ${credits.toLocaleString()}`;
  }
  function price() {
    if(!modelSelect) return;
    const model=catalog?.models.find(m=>m.id===modelSelect.value);
    const amount=model?.[$('length').value+'Price'];
    $('scene-price').textContent=model ? (session ? `${amount} credits per scene` : 'Guest generation: up to 10 scenes per session') : 'Generation is unavailable.';
    modelSelect.disabled=!session || !model;
    $('medium-length').disabled=!model?.mediumPrice || !model?.mediumOutput;
    if($('medium-length').disabled && $('length').value==='medium') {$('length').value='short';price();}
  }
  async function load() {
    const version=++loadVersion;
    try {
      const current=await readSession();
      if(version!==loadVersion) return;
      if(session?.user.id!==current?.user.id) catalog=null;
      session=current;
      renderAccount();
      if(!modelSelect && !session) return;
      const next=await call({action:'catalog'},session?.access_token);
      if(version!==loadVersion) return;
      catalog=next;
      if(modelSelect) {
        const selected=modelSelect.value;
        modelSelect.replaceChildren(...catalog.models.map(model=>{
          const label = model.id === 'gemini-3.1-flash-lite' ? 'Paper Sparrow' : model.label;
          return new Option(label, model.id);
        }));
        modelSelect.value=catalog.models.some(m=>m.id===selected) && session ? selected : catalog.models.find(m=>m.guestDefault)?.id || catalog.models[0]?.id || '';
      }
    } catch(error) {
      if(version!==loadVersion) return;
      catalog=null;
      $('account-status').textContent=error.message;
      if(modelSelect) $('status').textContent=error.message;
    }
    renderAccount();
    price();
  }
  if(modelSelect) window.DialogueAccount={
    async generate(payload) {
      if(!catalog?.enabled) throw new Error('Generation is unavailable.');
      const model=catalog.models.find(m=>m.id===$('model').value);
      let guestToken;try {guestToken=sessionStorage.getItem('rcg-dialogue-guest');}catch {}
      try {
        const current=await readSession();
        return await call({...payload,model:model?.id,quotedPrice:model?.[payload.length+'Price'],guestToken},current?.access_token);
      } finally {
        void load();
      }
    }
  };
  if(modelSelect) {
    $('account-controls').hidden=false;
    modelSelect.onchange=price;
    $('length').addEventListener('change',price);
  }
  $('open-account').onclick=()=>$('account-dialog').showModal();
  $('close-account').onclick=()=>$('account-dialog').close();
  $('sign-in-form').onsubmit=async event=>{
    event.preventDefault();
    if(!$('account-email').reportValidity()) return;
    $('send-link').disabled=true;
    try {
      const {error}=await client.auth.signInWithOtp({
        email:$('account-email').value.trim(),
        options:{emailRedirectTo:new URL('/dialogue/',location.href).href}
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
  client.auth.onAuthStateChange((event,current)=>{
    if(['SIGNED_IN','SIGNED_OUT','TOKEN_REFRESHED'].includes(event)) {
      if(session?.user.id!==current?.user.id) {
        ++loadVersion;
        catalog=null;
        session=current;
        $('account-status').textContent='';
        renderAccount();
        price();
      }
      setTimeout(load,0);
    }
  });
  void load();
})();

// Checkout events only trigger a server status check. They never change the balance.
window.DialoguePayments = function({readSession, refresh}) {
  const $ = id => document.getElementById(id);
  let userId = null, offer = null, pending = null, sdk = null, version = 0, timer = null, busy = false;
  const storageKey = () => `dialogue-purchase-${userId}`;
  const message = text => {$('payment-status').textContent = text;};
  function remember(value) {
    pending = value;
    try {if (value) localStorage.setItem(storageKey(), value); else localStorage.removeItem(storageKey());} catch {}
    $('check-payment').hidden = !value;
  }
  async function call(body) {
    const session = await readSession();
    if (!session || session.user.id !== userId) throw new Error('Sign in again to continue.');
    const response = await fetch('/api/payments', {
      method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`},
      body: JSON.stringify(body), signal: AbortSignal.timeout(45000)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The payment request failed. Please try again.');
    return data;
  }
  async function check(attempt = 0) {
    const id = pending, currentVersion = version;
    if (!id) return;
    clearTimeout(timer);
    $('check-payment').disabled = true;
    try {
      const result = await call({action: 'status', purchaseId: id});
      if (currentVersion !== version || id !== pending) return;
      if (result.status === 'fulfilled') {
        remember(null);
        message('Payment confirmed. Credits added.');
        await refresh();
      } else if (result.status === 'review') {
        message('Your payment needs review. Contact support.');
      } else {
        message('Payment is not confirmed yet. If you paid, check again shortly.');
        if (attempt < 10) timer = setTimeout(() => void check(attempt + 1), 3000);
      }
    } catch (error) {if (currentVersion === version) message(error.message);}
    finally {if (currentVersion === version) $('check-payment').disabled = false;}
  }
  function initializePaddle() {
    if (sdk) return sdk;
    sdk = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.onload = () => {
        try {
          if (offer.environment === 'sandbox') window.Paddle.Environment.set('sandbox');
          window.Paddle.Initialize({token: offer.clientToken, eventCallback: event => {
            if (['checkout.completed', 'checkout.closed'].includes(event.name) && userId && pending) {
              $('account-dialog').showModal();
              void check();
            }
          }});
          resolve(window.Paddle);
        } catch (error) {sdk = null; reject(error);}
      };
      script.onerror = () => {script.remove(); sdk = null; reject(new Error('Checkout could not load. Please try again.'));};
      document.head.append(script);
    });
    return sdk;
  }
  async function loadOffer() {
    const currentVersion = version;
    try {
      const result = await call({action: 'catalog'});
      if (version !== currentVersion) return;
      offer = result.pack ? result : null;
      $('credit-pack').hidden = !offer;
      $('credit-pack-placeholder').hidden = !!offer;
      if (offer) {
        const format = new Intl.NumberFormat(undefined, {style: 'currency', currency: offer.pack.currency});
        const price = format.format(offer.pack.amount / 10 ** format.resolvedOptions().maximumFractionDigits);
        $('pack-price').textContent = `${offer.pack.credits.toLocaleString()} credits — ${price} ${offer.pack.currency}`;
        $('pack-terms').textContent = offer.pack.terms;
      }
    } catch {
      if (version !== currentVersion) return;
      offer = null;
      $('credit-pack').hidden = true;
      $('credit-pack-placeholder').hidden = false;
    }
  }
  $('buy-credits').onclick = async () => {
    if (!offer || busy) return;
    const currentVersion = version;
    const selected = offer.pack;
    busy = true;
    $('buy-credits').disabled = true;
    message('Opening checkout…');
    try {
      const paddle = await initializePaddle();
      if (version !== currentVersion) return;
      const result = await call({action: 'checkout', pack: selected});
      if (version !== currentVersion) return;
      remember(result.purchaseId);
      // A modal dialog makes the external checkout iframe inert. Close it first.
      $('account-dialog').close();
      paddle.Checkout.open({transactionId: result.transactionId, settings: {displayMode: 'overlay', showAddDiscounts: false, allowLogout: false}});
      message('Complete payment in checkout.');
    } catch (error) {
      if (version === currentVersion) {
        $('account-dialog').showModal();
        message(error.message);
        void loadOffer();
      }
    } finally {
      busy = false;
      $('buy-credits').disabled = false;
    }
  };
  $('check-payment').onclick = () => void check();
  return {
    setSession(session) {
      const next = session?.user.id || null;
      if (next === userId) return;
      ++version;
      clearTimeout(timer);
      userId = next;
      offer = null;
      pending = null;
      $('credit-pack').hidden = true;
      $('credit-pack-placeholder').hidden = !userId;
      $('check-payment').hidden = true;
      message('');
      if (userId) {
        try {pending = localStorage.getItem(storageKey());} catch {}
        $('check-payment').hidden = !pending;
        void loadOffer();
        if (pending) void check();
      }
    }
  };
};

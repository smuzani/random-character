const encoder = new TextEncoder();
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const paddleId = (value, prefix) => typeof value === 'string' && new RegExp(`^${prefix}_[a-z0-9]{26}$`).test(value);
const safeErrors = new Set([
  'Verify your email first.', 'Purchase not found.', 'This credit pack is unavailable. Refresh the page.',
  'The pack changed. Review the new terms.', 'Too many checkout attempts. Try again later.',
  'Your payment needs review. Contact support.'
]);

export function createPaymentRpc(url, serviceKey, fetcher = fetch) {
  return async (action, data = {}) => {
    const response = await fetcher(`${url}/rest/v1/rpc/dialogue_payments`, {
      method: 'POST', headers: {apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({p_action: action, p_data: data}), signal: AbortSignal.timeout(10000)
    });
    const body = await response.json();
    if (!response.ok) throw Object.assign(new Error('Payment database operation failed.'), {
      publicMessage: safeErrors.has(body.message) ? body.message : undefined
    });
    return body;
  };
}

export function createPaddleApi({environment, apiKey, fetcher = fetch}) {
  return async (path, body) => {
    if (!['sandbox', 'production'].includes(environment) || !apiKey) throw new Error('Paddle is not configured.');
    const host = environment === 'sandbox' ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com';
    const response = await fetcher(host + path, {
      method: body ? 'POST' : 'GET', headers: {Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Paddle-Version': '1'},
      ...(body ? {body: JSON.stringify(body)} : {}), signal: AbortSignal.timeout(15000)
    });
    const result = await response.json();
    if (!response.ok || !result.data) throw new Error('Paddle request failed.');
    return result.data;
  };
}

// Never use client-provided prices, ownership, balances, or checkout callbacks as proof of payment.
export function transactionDetails(transaction) {
  const item = transaction?.items?.[0];
  if (!paddleId(transaction?.id, 'txn') || transaction.items?.length !== 1 || !Number.isInteger(item?.quantity) || item.quantity < 1 || item.quantity > 100 ||
      !paddleId(item.price?.id, 'pri') || item.price.billing_cycle !== null || transaction.subscription_id ||
      transaction.discount_id || transaction.collection_mode !== 'automatic' ||
      !uuid.test(transaction.custom_data?.purchase_id || '') ||
      item.price.unit_price?.currency_code !== transaction.currency_code ||
      !/^\d+$/.test(item.price.unit_price?.amount || '')) throw new Error('Unexpected Paddle transaction.');
  return {
    transactionId: transaction.id, purchaseId: transaction.custom_data.purchase_id,
    status: transaction.status, priceId: item.price.id, amount: item.price.unit_price.amount,
    currency: transaction.currency_code, quantity: item.quantity, total: transaction.details?.totals?.total
  };
}

export function createCheckoutService({rpc, authenticate, paddle, environment, clientToken, enabled = false, allowedOrigin, log = console.log}) {
  const configured = ['sandbox', 'production'].includes(environment) &&
    typeof clientToken === 'string' && clientToken.startsWith(environment === 'sandbox' ? 'test_' : 'live_');
  return async request => {
    const requestId = crypto.randomUUID();
    const headers = {'Cache-Control': 'no-store', 'X-Request-ID': requestId, 'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Headers': 'authorization, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin'};
    const reply = (body, status = 200) => Response.json({...body, requestId}, {status, headers});
    try {
      if (request.headers.get('origin') && request.headers.get('origin') !== allowedOrigin) return reply({error: 'Use the Dialogue site.'}, 403);
      if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers});
      if (request.method !== 'POST') return reply({error: 'Use POST.'}, 405);
      const raw = await request.text();
      if (encoder.encode(raw).length > 6000) return reply({error: 'Request is too long.'}, 413);
      let input;
      try {input = JSON.parse(raw);} catch {return reply({error: 'Send a valid request.'}, 400);}
      if (!input || typeof input !== 'object') return reply({error: 'Send a valid request.'}, 400);
      const authorization = request.headers.get('authorization');
      const user = authorization ? await authenticate(authorization) : null;
      if (!user?.id || user.is_anonymous || !user.email_confirmed_at) return reply({error: 'Sign in with a verified email to buy credits.'}, 401);
      // Status remains readable when new purchases are disabled.
      if (input.action === 'status') {
        if (!uuid.test(input.purchaseId || '')) return reply({error: 'Purchase not found.'}, 400);
        return reply(await rpc('status', {userId: user.id, purchaseId: input.purchaseId}));
      }
      if (input.action === 'catalog') {
        const pack = enabled && configured ? await rpc('catalog', {environment}) : null;
        return reply({pack, ...(pack ? {environment, clientToken} : {})});
      }
      if (input.action !== 'checkout') return reply({error: 'Unknown action.'}, 400);
      if (!enabled || !configured) return reply({error: 'Credit purchases are unavailable.'}, 503);
      if (!uuid.test(input.pack?.id || '')) return reply({error: 'Choose an available credit pack.'}, 400);
      const purchaseId = crypto.randomUUID();
      const purchase = await rpc('create', {
        purchaseId, userId: user.id, environment, packId: input.pack.id,
        amount: input.pack.amount, currency: input.pack.currency, credits: input.pack.credits, terms: input.pack.terms
      });
      const transaction = await paddle('/transactions', {
        items: [{price_id: purchase.price_id, quantity: 1}], currency_code: purchase.currency,
        collection_mode: 'automatic', custom_data: {purchase_id: purchaseId}
      });
      const details = transactionDetails(transaction);
      if (details.quantity !== 1 || details.purchaseId !== purchaseId || details.priceId !== purchase.price_id ||
          String(details.amount) !== String(purchase.amount) || details.currency !== purchase.currency) throw new Error('Price configuration mismatch.');
      await rpc('bind', {purchaseId, transactionId: transaction.id});
      return reply({purchaseId, transactionId: transaction.id});
    } catch (error) {
      log(JSON.stringify({event: 'dialogue_checkout_failed', requestId}));
      return reply({error: error.publicMessage || 'Checkout could not be started. Please try again.'}, error.publicMessage ? 400 : 503);
    }
  };
}

export async function verifyPaddleSignature(raw, header, secret, now = Date.now()) {
  if (!secret || !header) return false;
  const parts = header.split(';').map(part => part.trim().split('='));
  const timestamps = parts.filter(([key]) => key === 'ts').map(([, value]) => value);
  const signatures = parts.filter(([key, value]) => key === 'h1' && /^[a-f0-9]{64}$/i.test(value)).map(([, value]) => value);
  if (timestamps.length !== 1 || !/^\d+$/.test(timestamps[0]) || Math.abs(now / 1000 - Number(timestamps[0])) > 5) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), {name: 'HMAC', hash: 'SHA-256'}, false, ['verify']);
  for (const signature of signatures) {
    const bytes = Uint8Array.from(signature.match(/../g), byte => parseInt(byte, 16));
    if (await crypto.subtle.verify('HMAC', key, bytes, encoder.encode(`${timestamps[0]}:${raw}`))) return true;
  }
  return false;
}

export function createWebhookService({rpc, paddle, secret, environment, isAllowedSource, log = console.log}) {
  return async request => {
    const requestId = crypto.randomUUID();
    const reply = (body, status = 200) => Response.json(body, {status, headers: {'Cache-Control': 'no-store'}});
    if (request.method !== 'POST') return reply({error: 'Use POST.'}, 405);
    if (!secret || !['sandbox', 'production'].includes(environment)) return reply({error: 'Webhook unavailable.'}, 503);
    try {
      const raw = await request.text();
      if (encoder.encode(raw).length > 262144) return reply({error: 'Request is too long.'}, 413);
      if (!await verifyPaddleSignature(raw, request.headers.get('paddle-signature'), secret)) return reply({error: 'Invalid signature.'}, 401);
      if (isAllowedSource && !await isAllowedSource(request)) return reply({error: 'Source IP denied.'}, 403);
      const event = JSON.parse(raw);
      if (!paddleId(event.event_id, 'evt')) return reply({error: 'Invalid event.'}, 400);
      if (event.event_type === 'transaction.completed') {
        if (event.data?.status !== 'completed' || !paddleId(event.data?.id, 'txn')) return reply({error: 'Invalid transaction.'}, 400);
        // Re-fetch using our environment's API key, including on delayed/replayed events.
        const transaction = await paddle(`/transactions/${event.data.id}`);
        const details = transactionDetails(transaction);
        if (details.transactionId !== event.data.id || details.status !== 'completed' || !/^\d+$/.test(details.total || '')) throw new Error('Transaction is not complete.');
        await rpc('fulfill', {...details, eventId: event.event_id, environment});
      } else if (['adjustment.created', 'adjustment.updated'].includes(event.event_type)) {
        if (!paddleId(event.data?.id, 'adj')) return reply({error: 'Invalid adjustment.'}, 400);
        const adjustment = await paddle(`/adjustments/${event.data.id}`);
        if (adjustment.id !== event.data.id || !paddleId(adjustment.transaction_id, 'txn')) throw new Error('Invalid adjustment.');
        if (adjustment.status === 'approved' && ['refund', 'credit', 'chargeback', 'chargeback_warning'].includes(adjustment.action)) {
          await rpc('hold', {transactionId: adjustment.transaction_id, eventId: event.event_id, environment, reason: adjustment.action});
        }
      }
      return reply({received: true});
    } catch {
      // A non-2xx response asks Paddle to retry. Never acknowledge a failed grant.
      log(JSON.stringify({event: 'dialogue_webhook_failed', requestId}));
      return reply({error: 'Payment processing failed.', requestId}, 503);
    }
  };
}

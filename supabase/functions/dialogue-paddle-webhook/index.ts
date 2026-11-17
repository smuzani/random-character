import {createWebhookService, createPaddleApi, createPaymentRpc} from '../_shared/payments.mjs';
const environment = Deno.env.get('PADDLE_ENVIRONMENT') || 'sandbox';
let cachedIps: {addresses: Set<string>; expiresAt: number} | undefined;
let pendingIps: Promise<Set<string>> | undefined;

async function isPaddleSource(request: Request) {
  // The hosted Supabase gateway sits behind Cloudflare. Verify this header is
  // overwritten by the gateway before deploying behind a different ingress.
  const address = request.headers.get('cf-connecting-ip');
  if (!address) return false;
  if (!cachedIps || cachedIps.expiresAt <= Date.now()) {
    pendingIps ??= (async () => {
      const response = await fetch('https://api.paddle.com/ips', {signal: AbortSignal.timeout(3000)});
      if (!response.ok) throw new Error('Paddle IP lookup failed.');
      const {data} = await response.json();
      const cidrs = data?.ipv4_cidrs;
      if (!Array.isArray(cidrs) || !cidrs.length ||
          !cidrs.every(cidr => typeof cidr === 'string' && /^\d{1,3}(\.\d{1,3}){3}\/32$/.test(cidr))) {
        throw new Error('Paddle IP lookup returned invalid addresses.');
      }
      const addresses = new Set<string>(cidrs.map(cidr => cidr.slice(0, -3)));
      cachedIps = {addresses, expiresAt: Date.now() + 300_000};
      return addresses;
    })().finally(() => {pendingIps = undefined;});
    return (await pendingIps).has(address);
  }
  return cachedIps.addresses.has(address);
}

Deno.serve(createWebhookService({
  rpc: createPaymentRpc(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!),
  paddle: createPaddleApi({environment, apiKey: Deno.env.get('PADDLE_API_KEY')}), environment,
  secret: Deno.env.get('PADDLE_WEBHOOK_SECRET'),
  isAllowedSource: environment === 'production' ? isPaddleSource : undefined
}));

import {createCheckoutService, createPaddleApi, createPaymentRpc} from '../_shared/payments.mjs';
const url = Deno.env.get('SUPABASE_URL')!;
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const environment = Deno.env.get('PADDLE_ENVIRONMENT') || 'sandbox';
const apiKey = Deno.env.get('PADDLE_API_KEY');
Deno.serve(createCheckoutService({
  rpc: createPaymentRpc(url, serviceKey), paddle: createPaddleApi({environment, apiKey}), environment,
  clientToken: Deno.env.get('PADDLE_CLIENT_TOKEN'),
  enabled: Deno.env.get('PADDLE_CHECKOUT_ENABLED') === 'true' && !!apiKey,
  allowedOrigin: Deno.env.get('DIALOGUE_ORIGIN') || 'https://random-dialogue-muzani.netlify.app',
  authenticate: async (authorization: string) => {
    const response = await fetch(`${url}/auth/v1/user`, {
      headers: {apikey: serviceKey, Authorization: authorization}, signal: AbortSignal.timeout(10000)
    });
    return response.ok ? response.json() : null;
  }
}));

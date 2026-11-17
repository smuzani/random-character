# Dialogue credit purchases with Paddle

Issue: [#23](https://github.com/smuzani/random-character/issues/23).

The launch pack is US$1.00 for 100 credits. Purchases start disabled. Live Paddle credentials and checkout activation remain pending. The sandbox price ID is `pri_01m7f7smdgv0qjhkcn68whmaed` (provided by the owner).

## Payment flow

1. The account dialog loads the enabled pack after sign-in.
2. The dialog shows the credit quantity, currency, price, and terms before checkout.
3. The server verifies the Supabase user and the displayed quote.
4. The database stores the buyer and a copy of the pack terms.
5. The server creates a Paddle transaction and binds its ID to the purchase.
6. Paddle.js opens that transaction in an overlay.
7. The webhook verifies the raw-body signature and fetches the transaction from Paddle.
8. The database grants purchased credits once, in the same transaction as the fulfillment record.
9. The browser reads the purchase status and refreshes the balance.

Browser checkout events never grant credits. Purchases require a verified, non-anonymous account. The buyer comes from Supabase Auth, not checkout metadata or the payment email.

The ledger deduplicates event IDs and provider transaction IDs. The generation lock also protects payment grants. Welcome credits remain separate and are spent first.

Purchase status survives a page reload through local storage. The browser polls for approximately 30 seconds after checkout. The Check payment button handles longer delays.

## Sandbox configuration

Use a separate staging Supabase project and a Netlify preview. Sandbox credits must not enter production accounts.

1. Apply all repository migrations to the staging database.
2. Create a Paddle sandbox account.
3. Create one active product and a US$1.00 one-time price with a minimum quantity of 1 and maximum of 10. Each unit grants 100 credits.
4. Disable regional price overrides and discounts for this launch offer.
5. Set the Paddle default payment link to the staging Dialogue URL.
6. Create an API key with transaction read/write and adjustment read access.
7. Create a sandbox client-side token.
8. Create a webhook destination for these events:
   - `transaction.completed`
   - `adjustment.created`
   - `adjustment.updated`

Webhook URL:

```text
https://STAGING_PROJECT.supabase.co/functions/v1/dialogue-paddle-webhook
```

Set these secrets in the staging Supabase project:

| Secret | Value |
| --- | --- |
| `PADDLE_ENVIRONMENT` | `sandbox` |
| `PADDLE_API_KEY` | Sandbox API key |
| `PADDLE_CLIENT_TOKEN` | Sandbox `test_…` client token |
| `PADDLE_WEBHOOK_SECRET` | Destination secret |
| `PADDLE_CHECKOUT_ENABLED` | `false` until the offer and webhook are ready |
| `DIALOGUE_ORIGIN` | Exact staging origin |

The client token is public. The API key and webhook secret must stay on the server.

Deploy `dialogue-payments`, `dialogue-paddle-webhook`, and the existing `dialogue` function. Their JWT gateway settings are in `supabase/config.toml`. The payment function validates users through Supabase Auth. The webhook validates Paddle signatures instead of user tokens.

Use the existing Netlify Supabase build variables for the staging project. The `/api/payments` proxy forwards requests to the payment function. No Paddle secret belongs in Netlify browser configuration.

## Launch offer

The owner selected US$1.00 for 100 credits. Use the approved refund policy below when setting the pack terms. The current implementation has no credit expiry mechanism. The terms must state that credits do not expire.

The ledger permits at most US$0.01 of provider liability per credit. This pack therefore permits US$1.00 of generation costs before payment fees. Its price does not cover the maximum liability plus fees. Actual generation costs can be lower. The researched standard Paddle fee is 5% + US$0.50. Recheck the fee before launch.

The setup script fixes the amount at 100 USD cents and the credit quantity at 100. It inserts a disabled offer.

Create the offer through an administrator connection. Replace every placeholder before execution:

```sh
psql "$STAGING_DATABASE_URL" \
  -v paddle_environment=sandbox \
  -v paddle_price_id=pri_01m7f7smdgv0qjhkcn68whmaed \
  -v pack_terms='APPROVED_PACK_TERMS' \
  -f supabase/configure-dialogue-pack.sql
```

Use Paddle minor currency units for `amount`. For USD, 100 means US$1.00. The amount and currency must match the Paddle price exactly. The terms must explain taxes, refunds, no expiry, and use only within Dialogue.

Enable the single offer in staging. Then set `PADDLE_CHECKOUT_ENABLED=true` in staging. Production must remain disabled until the staging tests pass.

For future price changes, disable the old offer and insert a new offer. Existing purchases retain their original terms and credit quantity.

## Verification

Run the JavaScript tests:

```sh
node --test dialogue/tests/account.test.mjs dialogue/tests/service.test.mjs dialogue/tests/generate.test.mjs dialogue/tests/payments.test.mjs dialogue/tests/payments-browser.test.mjs tests/character-sharing.test.cjs
node dialogue/build-site.mjs
```

The database tests erase test rows. Use only a disposable database with all migrations and Supabase auth roles:

```sh
DIALOGUE_TEST_DATABASE=postgresql://USER@HOST:PORT/DISPOSABLE_DATABASE node --test dialogue/tests/ledger.test.mjs
```

Local tests cover signed and invalid notifications, unpaid transactions, quote tampering, duplicate grants, concurrency, delayed fulfillment, ownership, rollback, and payment holds.

Before launch, complete these staging checks:

1. Sign in through a real email link.
2. Verify the displayed price and terms against the Paddle checkout.
3. Complete a sandbox payment with the real Paddle SDK.
4. Verify one purchased-credit grant and the updated browser balance.
5. Replay the notification and verify that the balance does not increase.
6. Close an unpaid checkout and verify that it grants no credits.
7. Delay webhook delivery, reload the page, then replay the notification.
8. Verify that another account cannot read the purchase status.
9. Complete sandbox refund and dispute tests, including an adjustment before the completed notification.
10. Verify that the checkout works under the deployed Content Security Policy on mobile and desktop.

Sandbox verification on 16 November 2026 passed through the Netlify preview and a local Supabase backend. Email-link sign-in, real Paddle SDK checkout, a declined test card, a successful 100-credit purchase, a two-pack purchase adding 200 credits, and webhook replay were checked. All 63 automated tests passed, including quantity limits and atomic multi-pack grants.

### Temporary Netlify sandbox

Preview: https://paddle-sandbox--random-dialogue-muzani.netlify.app/dialogue/

The preview uses local Supabase through a restricted ngrok gateway. Keep this Mac awake with OrbStack, the gateway, the tunnel, and Edge Functions running. Production is unchanged. Scene generation is disabled in this sandbox.

To try checkout:

1. Open the preview and select **Sign in**.
2. Enter an email address and request a sign-in link.
3. Open http://127.0.0.1:54324 on this Mac. Open the test email and follow its link in the same browser.
4. Open the account dialog and select **Buy credits**. Confirm that Paddle shows **Test Mode**.
5. Use card `4242 4242 4242 4242`, a future expiry, and CVC `123`.
6. Wait for the balance to update after payment confirmation.

For this local sandbox, set the Supabase Auth site URL and allowed redirect to the preview URL shown above in the sandbox configuration. Keep those overrides out of the shared Supabase config.

Runtime files are ignored under `dialogue/.netlify/paddle-sandbox/`. They include credentials; do not commit or publish them. The isolated preview artifact is under `dialogue/.netlify/paddle-preview/`. If the tunnel URL changes, rebuild that artifact and update the sandbox notification destination before testing again.

Live launch still requires the live credentials and catalog, production webhook configuration, and the remaining staging checks above. Copy the published purchase and refund terms into the live offer. Remove “Coming Soon...” from `pricing.html` when checkout goes live.

## Refunds and disputes

Approved refund, credit, chargeback, and chargeback-warning adjustments place the buyer on hold. Holds block new signed-in generation and new purchases. Existing requests can finish or return their reserved credits. The hold still blocks further spending.

This version does not automatically calculate credit reversals for partial refunds or spent credits. An operator must reconcile each adjustment before release. The retained purchase and event records support that review. Purchased credits share an account balance, so define how to attribute usage across packs and record each account’s one-time partial-pack refund before accepting live payments.

1. Find unresolved rows in `dialogue.payment_holds`.
2. Verify the adjustment in Paddle and the original purchase in `dialogue.purchases`.
3. Wait for pending generation requests to settle, or run `dialogue_service('reconcile')` after their ten-minute expiry.
4. Calculate the credit reversal under the approved refund policy.
5. Acquire advisory transaction lock `2200261109` in an administrator transaction.
6. Adjust the purchased balance and record the reconciliation in the hold reason.
7. Set `resolved_at` only after reconciliation is complete.

Do not erase purchase or event records. A duplicate completed notification cannot grant another pack after a reversal.

## Recovery and rollback

Set `PADDLE_CHECKOUT_ENABLED=false` to stop new purchases. Keep the webhook and purchase-status endpoint available for existing payments. Disabling the offer does not cancel an existing checkout.

The webhook returns a retryable error when verification or fulfillment fails. Application logs contain request IDs, not raw payment data or secrets. Monitor `dialogue_webhook_failed` and unresolved payment holds.

If transaction creation succeeds but binding fails, the browser receives no checkout transaction. The unpaid Paddle draft can remain orphaned. Each buyer can start ten checkout attempts per hour. No server action automatically charges a card.

For production, create separate live credentials, a live price, and a live webhook destination. Complete Paddle account and domain approval. Set the environment to `production` and use a `live_…` client token. Never change a staging database into the production billing ledger.

The existing live pack uses price `pri_01m7k9kbqqrp6n2zr7460ygm1e`. Use this ID with `paddle_environment=production` when configuring the disabled live offer. The application currently accepts up to 10 packs per order.

Use the root `.env.example` for live Edge Function settings. The live webhook checks the signed request against the IP list from `https://api.paddle.com/ips`. It caches the list for five minutes and denies requests with missing or unlisted source IPs. Before enabling live delivery, verify in staging that the hosted gateway supplies and overwrites `CF-Connecting-IP` on every path to the function.

## References

- [Paddle prepaid AI credits](https://developer.paddle.com/get-started/how-paddle-works/ai-companies/)
- [Paddle transaction creation](https://developer.paddle.com/api-reference/transactions/create-transaction/)
- [Checkout initialization](https://developer.paddle.com/paddle-js/methods/paddle-initialize/)
- [Webhook signatures](https://developer.paddle.com/webhooks/about/signature-verification/)
- [Completed transaction events](https://developer.paddle.com/webhooks/transactions/transaction-completed/)
- [Adjustment events](https://developer.paddle.com/webhooks/adjustments/adjustment-created/)
- [Supabase function configuration](https://supabase.com/docs/guides/functions/function-configuration)

## Approved refund policy

The policy selected on 17 November 2026 allows full refunds for all unused packs and one full-price refund for a partially used pack per account. Fully used packs are outside this voluntary policy; mandatory rights still apply. See `refunds.html`. Refund handling and the one-time allowance require manual review; this integration does not yet automate those decisions.

# Dialogue on Supabase

Issue #22 moves generation, accounts, credit reservations, and tracing to Supabase. Netlify serves the static site. Payment integration belongs to [#23](https://github.com/smuzani/random-character/issues/23).

## Project status

Project: `random-character-generator` (`fymrkzwbvdgvaxqzuiht`). Organization: `muzani`. Region: Singapore (`ap-southeast-1`).

The database migrations and `dialogue` Edge Function are deployed and enabled. Live guest generation passed with three speakers (request `c5b004c4-844b-44c4-91a5-99bde122f731`). The production Netlify site still uses its existing backend.

The sign-in preview is deployed at https://6af41a38b018ade3862c443a--random-dialogue-muzani.netlify.app/dialogue/. Browser checks confirmed the guest catalog and email-link form. Public email delivery and a complete signed-in session remain unverified.

The approved monthly cap is US$50: US$25 for guests and US$25 for welcome grants.

The Gemini secret is configured. Before cutover, configure email delivery and complete signed-in generation checks. The local PostgreSQL tests cover concurrency and refunds. The hosted transaction test did not run because its confirmation expired.

## Spending rules

The global guest pool takes priority. New sessions, private windows, and other devices all use that pool. Each session also permits ten generation attempts. A guest session starts on the first generation request.

Only the Edge Function can call the billing dispatcher. Anonymous and authenticated browser roles have no access to billing tables. The dispatcher serializes financial operations with a transaction lock.

Credits are integer units. Each credit permits at most US$0.01 of provider liability. Model prices must cover two calls at their maximum input and output limits. Welcome grants reserve this liability when granted, even if the user spends those credits in a later month.

USD costs use integer millionths of a dollar. The monthly cap covers guest reservations and welcome grants. Purchased credit funding remains separate for #23.

A guest call reserves its full cost ceiling before contacting Gemini. The retry requires another reservation. Reservations remain spent when usage is missing or a process stops. This conservative rule can exhaust the guest pool before actual provider costs reach the allocation.

Signed-in requests reserve welcome credits first, then purchased credits. A validated scene consumes the reservation once. A failed request returns the reservation once. Requests older than ten minutes expire during the next ledger operation. Run `reconcile` periodically to release reservations without user traffic.

## Deployment

1. Create a dedicated Supabase project for Random Character Generator.
2. Apply all files in `supabase/migrations/` in filename order.
3. Enable email authentication and email confirmation.
4. Keep the magic-link template with `{{ .ConfirmationURL }}`. The pinned Supabase SDK manages PKCE and session refresh.
5. Configure production SMTP and the authentication rate limits.
6. If the site origin changes, set `DIALOGUE_ORIGIN` to its exact origin without a trailing slash.
7. Store `GEMINI_API_KEY` as a Supabase Edge Function secret.
8. Deploy the `dialogue` function with `verify_jwt=false`.

The default origin is `https://random-dialogue-muzani.netlify.app`.

The function validates supplied access tokens through Supabase Auth. Guests do not supply tokens. Invalid tokens never fall back to guest access.

The project supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Never place the service key in browser settings.

## Launch settings

New installations start disabled. The live project is enabled with the approved allocations and 100 welcome credits (US$1 liability) per eligible verified account. Its default model is `gemini-3.1-flash-lite`: 2 credits per scene, 2,200 output tokens, and input/output rates of `250000`/`1500000`.

Set these database values before enabling generation:

| Table | Values |
| --- | --- |
| `dialogue.settings` | Monthly cap, guest allocation, welcome allocation, welcome credits, welcome cost |
| `dialogue.models` | Gemini API model ID, label, token rates, fixed scene prices, output limits, enabled state |

Token rates use USD millionths per million tokens. For example, US$0.25 per million tokens becomes `250000`. Use current provider rates, including the relevant input tier. The reservation assumes at most 20,000 input tokens. The Edge adapter limits the incoming request to 12,000 UTF-8 bytes. Shared instructions fit within the remaining bound.

Set exactly one enabled model as `guest_default`. Use `gemini-3.1-flash-lite` to retain the current default. Additional model IDs must support the Gemini `generateContent` API and JSON output. Other provider protocols need another adapter.

Set `medium_price` and `medium_output` to NULL to disable medium scenes. Short scenes require both a price and an output limit. Prices must cover the initial call and one retry. Welcome cost must cover `welcome_credits * 10000`.

Keep the monthly allocations within the monthly cap. Set `enabled=true` only after staging checks pass.

For the Netlify build, set:

```text
DIALOGUE_BACKEND=supabase
DIALOGUE_SUPABASE_URL=https://fymrkzwbvdgvaxqzuiht.supabase.co
DIALOGUE_SUPABASE_PUBLIC_KEY=sb_publishable_5TpIX4CG64ZBVMUvgmiXQQ_O-zKnqUc
```

The build writes public settings to `dialogue/dist/dialogue/public-config.js`. The source file contains no credentials. A Supabase build fails when these settings are missing or the key is not publishable.

## Email delivery setup

Use Resend with `auth.random-character.com` and sender `Random Character Generator <noreply@auth.random-character.com>`.

1. Create or sign into the intended Resend account.
2. Add `auth.random-character.com` as a sending domain.
3. Copy the exact DNS records Resend provides into the Netlify DNS zone for `random-character.com`. Do not replace existing mail records.
4. Wait for Resend to verify the domain.
5. Create a sending API key. Enter it directly into Supabase's SMTP password field; do not put it in chat or repository files.

Supabase custom SMTP settings:

| Setting | Value |
| --- | --- |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | Resend API key |
| Sender email | `noreply@auth.random-character.com` |
| Sender name | `Random Character Generator` |

The configured Auth Site URL is `https://random-dialogue-muzani.netlify.app/dialogue/`. Add an exact preview callback URL to Auth redirect URLs before testing email links on a preview. Update these URLs if the application moves to a custom domain.

The browser uses the vendored Supabase SDK for authentication. Catalog and generation requests use the same-origin `/api/dialogue` Netlify proxy. The Edge Function validates access tokens before any account operation.

Resend setup is pending. No live email has been sent or verified during these checks.

Reference: [Resend with Supabase SMTP](https://resend.com/docs/send-with-supabase-smtp).

## Verification

Run the JavaScript regression suite:

```sh
node --test dialogue/tests/account.test.mjs dialogue/tests/generate.test.mjs dialogue/tests/service.test.mjs tests/character-sharing.test.cjs
```

The ledger tests require a disposable PostgreSQL database with the migration applied. They erase billing test rows. They also require `auth.users` and the Supabase database roles.

```sh
DIALOGUE_TEST_DATABASE=postgresql://USER@HOST:PORT/DISPOSABLE_DATABASE node --test dialogue/tests/ledger.test.mjs
```

Before production cutover:

1. Generate scenes with two and three characters as a guest.
2. Sign in through a real email link in the browser that requested it.
3. Generate scenes with two and three characters while signed in.
4. Verify the displayed quote against the reserved and settled credits.
5. Force a provider failure with a staging-only invalid model or key.
6. Find the browser request ID in the Edge logs and database records.
7. Verify that failed scenes return reserved credits.
8. Run simultaneous requests against a small balance and guest allocation.
9. Verify that new guest sessions cannot bypass the exhausted pool.
10. Verify the exhausted welcome pool and repeated sign-ins.
11. Run `public.dialogue_service('reconcile')` after a simulated process crash.

Do not use production credentials or accounts for failure tests.

## Budget alerts

The Codex budget-check automation was removed at the owner’s request. This project belongs to another account. No scheduled budget notifications are active here. The database still enforces the spending limits.

## Tracing

Generation errors include `requestId`. The same value appears in structured Edge logs and `dialogue.requests.id`. Attempt records include model, elapsed time, provider status, finish reason, retry index, validation, token usage, and cost.

Application logs contain no prompts, scripts, email addresses, credentials, or raw provider errors. Unknown provider usage remains NULL. `dialogue.cost_summary` reports known cost, unknown calls, conservative cost, and cost per usable scene. Failed calls and retries contribute to cost.

Inspect a request with an administrator connection:

```sql
select * from dialogue.requests where id = 'REQUEST_UUID';
select * from dialogue.attempts where request_id = 'REQUEST_UUID' order by attempt;
select * from dialogue.cost_summary;
```

## Rollback

Before cutover, remove `GEMINI_API_KEY` from Netlify. Keep it only in Supabase. Preserve the database and its ledger during rollback.

The updated Netlify `/api/generate` handler forwards legacy requests to Supabase when `DIALOGUE_BACKEND=supabase`. These requests share the guest spending pool. They do not spend signed-in credits.

If the Edge deployment fails, set `dialogue.settings.enabled=false`. Restore a known compatible Edge version. Keep the same database, accounts, balances, and attempt records. An old Netlify deployment without its Gemini key cannot bypass spending limits.

Do not restore the ungated Netlify Gemini key. Do not reverse the billing migration or reset monthly totals.

## References

- [Supabase function authentication](https://supabase.com/docs/guides/functions/auth)
- [Supabase email codes](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [Supabase function logs](https://supabase.com/docs/guides/functions/logging)

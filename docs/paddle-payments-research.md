# Paddle for Dialogue credit purchases

Research date: 15 November 2026. Scope: [issue #23](https://github.com/smuzani/random-character/issues/23). This note proposes a provider and implementation approach. It does not enable payments.

## Recommendation

Paddle is a good candidate for one-time Dialogue credit packs. Its AI guide explicitly supports prepaid credits as one-time products, with balances in the application. Native usage billing remains in beta and is unnecessary for this design. [Paddle AI guide](https://developer.paddle.com/get-started/how-paddle-works/ai-companies/)

Paddle acts as merchant of record and handles sales tax collection and remittance for its transactions. Its published checkout fee is 5% + US$0.50, with no monthly fee. Products under US$10 can receive bespoke pricing through sales. [Pricing](https://www.paddle.com/pricing)

For illustration, the published fee on US$10 is US$1, or 10%. On US$20, it is US$1.50, or 7.5%. These calculations exclude generation costs, refunds, and other adjustments. They do not establish a profitable pack size.

## Eligibility and launch requirements

Malaysia does not appear on the unsupported supplier-country list. This supports eligibility in principle, not account approval. [Supported supplier countries](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle)

The acceptable-use policy prohibits virtual currency and stored value. It also restricts some content generation, including impersonation and prohibited content. The AI guide separately supports prepaid usage credits. The proposed interpretation is a pack of non-transferable Dialogue generations, without cash redemption or use outside this application. Product approval remains necessary. [Acceptable-use policy](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle), [AI guide](https://developer.paddle.com/get-started/how-paddle-works/ai-companies/)

Live payments require account verification and an approved checkout domain. Sandbox testing does not require live account approval. [Go-live checklist](https://developer.paddle.com/build/go-live-checklist/), [Domain review](https://www.paddle.com/help/start/account-verification/what-is-domain-verification)

## Proposed fulfillment design

The following decisions adapt Paddle primitives to issue #23. They are application design recommendations.

1. Require sign-in before purchase. Create a local purchase record tied to the authenticated user.
2. Create the Paddle transaction on the server with an approved price ID and fixed quantity. Store its transaction ID locally. Include the local purchase ID in `custom_data`. Never derive ownership or credit quantity from browser-supplied metadata. Paddle supports server-created transactions and custom data. [Transactions](https://developer.paddle.com/api-reference/transactions/create-transaction/), [Custom data](https://developer.paddle.com/build/transactions/custom-data/)
3. Grant credits only after a verified `transaction.completed` webhook. Verify the signature against the original request body and endpoint secret. Apply timestamp replay protection. Match the transaction, price, quantity, currency, and purchase record before fulfillment. Browser checkout callbacks only update the interface. [Fulfillment event](https://developer.paddle.com/build/go-live-checklist/), [Signature verification](https://developer.paddle.com/webhooks/about/signature-verification/)
4. Deduplicate events by `event_id`. Enforce a separate unique constraint on the provider transaction ID for the credit grant. Commit fulfillment and the grant atomically. Paddle delivers events at least once and can deliver them out of order. [Webhook delivery](https://developer.paddle.com/webhooks/about/how-webhooks-work/)
5. Keep purchased credits separate from welcome credits. Spend welcome credits first, as issue #23 requires.
6. Handle both `adjustment.created` and `adjustment.updated`. Some refunds start approved, while others need approval. Define credit reversal rules for refunds, chargebacks, partial refunds, and already-spent credits. [Adjustment events](https://developer.paddle.com/webhooks/adjustments/adjustment-updated/)

## Remaining decisions and tests

The owner still needs to choose the pack price, currency, credit quantity, expiry terms, and refund policy. Credit quantity needs generation-cost evidence. No account, credentials, product approval, or negotiated fee was verified during this research.

Staging tests must cover unpaid transactions, invalid signatures, tampered purchase data, delayed delivery, concurrent duplicates, and refunds before or after fulfillment. Purchases remain disabled until sandbox checkout and ledger fulfillment pass together.

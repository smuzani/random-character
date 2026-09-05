# Architecture

## Current application

V7.6 is a static HTML, CSS, and JavaScript site. The public generator needs no build step or backend.

The engine generates traits, then resolves appearance, clothing, palette seeds, and concepts. `characterSections()` assembles section text. The page renders that text.

The roll lab uses the same engine through `buildCharacter(opts)`. Seed replay supports repeatable content reviews.

## Boundaries

- Keep core generation fast and available offline.
- Keep generation and section data separate from DOM rendering.
- Preserve the lab contract during engine changes.
- Use data rules for weights, requirements, and exclusions.
- Reuse written content from the Bolt prototype. Its code and architecture are excluded.

## Future application

V8 uses Next.js for the web application and secure backend routes. It does not use Vite or the Bolt architecture.

Accounts, cloud storage, and AI integrations need backend services. Core generation remains available on the client.

Creation Flow adds trait locks and individual rerolls. Dependent appearance, clothing, and concept rules must remain consistent after each change.

See [ROADMAP_CHECKLIST.md](ROADMAP_CHECKLIST.md) for remaining features.

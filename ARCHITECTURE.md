# Architecture

The [public roadmap](roadmap.html) summarizes feature plans. [V8_SPEC.md](V8_SPEC.md) defines the agreed V8 scope. This document records implementation choices and technical boundaries.

## Current application

V7.9 is a static HTML, CSS, and JavaScript site. The public generator needs no build step or backend.

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

Datasets, login, and ownership are the core V8 changes. The database stores generation content and rules. The client downloads published versions and generates characters locally.

Dataset selections pin versions and include declared dependencies. Explicit updates validate a complete dependency set before the client switches versions.

Anonymous accounts support initial use and authoring. Linked logins provide access across devices. The backend stores characters, presets, datasets, permissions, and reviewed changes.

Saved characters retain rendered text and exact source variants. Dataset updates do not regenerate saved text.

Shared tags come from a maintainer-controlled base dependency. Dataset forks retain those tag references. Existing attribute types and generation behavior remain the baseline.

Planned creation controls add trait locks and individual rerolls. Their release version is undecided. Dependent appearance, clothing, and concept rules must remain consistent after each change.

The first V8 release scope is recorded in [V8_SPEC.md](V8_SPEC.md). No release date is set. AI integrations remain later scope.

[ROADMAP_CHECKLIST.md](ROADMAP_CHECKLIST.md) tracks remaining work from the public roadmap.

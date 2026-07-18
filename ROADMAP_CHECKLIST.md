# Roadmap Checklist & Migration Plan

Based on [roadmap.html](roadmap.html) and survey results. Current version: **V7.4 (8 Aug 2023)**.

---

## Migration Plan: V7 → V8

**Current Status:** We are maintaining V7 (currently at V7.4.x, having just completed the Tier 1 data ports).
> **Note:** The "Bolt" app was strictly a rapid prototype in Expo/React Native and is NOT part of the RCG codebase. We are exclusively salvaging its written data (like descriptions) but discarding its code and architecture.

### The Path Forward
1. **V7 Incremental Updates**: Port low-risk data (like the want stubs) into the live V7 engine so users benefit immediately.
2. **V8 Rewrite**: Build a brand new, robust web architecture from scratch. **V8 will NOT use Vite or Bolt's architecture.** It requires a properly engineered solution that supports scalability, type-safety, and future backend integrations.

---

## Prioritized Backlog (Sorted by Risk × Completeness × Effort)

### Tier 1: Pure Data Ports (Zero Risk)
*Bolt data is complete; these are copy-paste jobs.*
- [x] **Fill 22 stubbed want descriptions** — Done (Copied Bolt's want texts into V7's `wantToDesc()`)
- [x] **Uncomment 22 disabled `initWants()` entries** — Done

### Tier 2 / V7.5 Expansion (Medium Risk)
*These features will be built client-side to keep the generator instant and offline, acting as the bridge to V8. They require a new UI overhaul and a lightweight Rules Engine to handle the data structure.*
- [x] **Appearance System** (Skin, hair, eyes, physique, facial hair) — V1 live in `js/appearance-details.js` (two-layer: free-rolling colors + tag-aware body/style; generic `rollRules()` engine for clothing/palette to reuse)
- [x] **Palette generator** — V1 live in `js/palette-details.js` (dependency-free port of Bolt's harmony engine; renders as the portrait pie in the header card). The character's physical coloring now seeds it: hued eye/hair rules in `js/appearance-details.js` carry a `hue`, `rollAppearance()` picks one as `baseHue`, and the harmony is built around it (landing as Primary or Accent by coin-flip).
- [x] **Trait → color mapping** — Done, but *not* as the original follow-up framed it. A blanket `tag → ColorFamily` table was rejected: most personality has no honest color, and "ruthless is red" would be invented. Instead only tropes that **name** a color carry one. A color trope sets an `A*` pin tag (`AHAIRRED`, `AEYESBLUE`, …); the matching appearance rule's `forcedBy` wins its layer, and a pinned color beats the random seed pick in `pickSeed()`. So Fiery Redhead ⇒ red hair ⇒ red palette. Eight tropes ship; gendered ones (Fiery Redhead, Dumb Blonde, Raven Hair Ivory Skin, Distinguished Gentleman's Gray) carry `TFEMALE`/`TMALE` and so vanish under "No gender stereotypes". Lands on ~7% of characters.
- [x] **Neutral palettes (black / gray / white families)** — Restores Bolt's `ColorFamily` `'black'`/`'white'`, which the V1 port dropped by accident: they were entangled with the user-picked-family feature the PRD cut, so the engine could not emit *any* gray, black or white (measured: 11k swatches, saturation never below 24%, lightness never outside 20–85%). A palette seed is now `{ hue }` **or** `{ family }`; a neutral family drives the whole triplet desaturated inside one lightness band, with relaxed ΔE/ΔL gates to match. `gray` is ours — Bolt had only black/white and silver hair needs a mid band. Black hair (the most common roll, and previously seedless) and gray hair now steer the palette, so **~20–23% of characters get a neutral scheme**.
  - *Deviation from Bolt:* its complementary generator neutralized only the dominant and left the complement fully saturated, contradicting its own triadic/analogous. We keep the neutral consistent across every harmony.
  - *Note:* the `white` family is implemented but unused — no rule seeds it. Skin stays seedless on purpose (letting every pale character drive an ivory palette would wash out a good share of the cast), so Raven Hair Ivory Skin steers via its hair pin and its skin pin is header-only.
- [x] **Clothing system** (fashion → outfit → flair → accessory) — Live in `js/clothing-details.js` as four `rollRules()` layers; the fashion roll adds a `fashion_*` tag that gates the rest. Bolt's data ported with its gates *repaired*, not copied: Bolt let elegant characters roll Jeans/Athletic (74% of the time, measured), gave casual/classic/modest/tomboy (~47% of rolls) an empty flair pool, left several fashion styles with female-only or single-entry outfit pools, and shipped a "Stylish Hat" requiring classic AND quirky at once (impossible after one fashion roll). Color flairs (Red Accents, White Coloring…) join the palette-seed pool **unpinned** — trope-pinned hair still wins, but a flair can steer an otherwise unseeded palette, and White Coloring finally exercises the dormant `white` neutral family. Renders as a collapsed native `<details>` at the bottom of Physical Attributes with the outfit name in the summary. Silent "none" rolls; no Bootstrap (the accordion is why: `index.html` never actually loaded Bootstrap, and 240KB for one widget fails the instant-load principle).
- [x] **Character concept generator** (adj+noun concept system) — Live in `js/concept-details.js`, rendered as the subtitle under the name in the portrait header ("Vengeful Assassin"). Bolt's word lists survive nearly verbatim; its ~200-key tag-bias map was rekeyed to V7's tag strings (every want and plot value differed, `villainous`→`heel`, `mysterious`→V7's live `'myterious'`), keyed with V7 constants as computed properties so a bad key fails at load. Rolls **last**, off the full end-of-roll tag set: `fashion_*` tags from the clothing roll and new `facial_hair_*` adds from the beard/mustache rules bias it. Bolt's double-adjective rule (<15 chars) could never fire; retuned to 1-in-4 capped at 28 chars (~23% measured). Dropped: race keys (V7 has no race system), five wants and four plots V7 lacks, one slur in the noun list.

### Tier 3: Major Features (Higher Risk)
*Needs significant UI design and complex engine logic.*
- [ ] **Obstacle system** (Replace plots, or add alongside?)
- [ ] **Export/share** (Formatted text export)
- [ ] **Aspect reroll/replacement** (Swap individual aspects - part of the Creation Flow UI)

### Tier 4: V8-Only Features (The Cloud Transition)
*These require a centralized database and cannot be done locally.*
- [ ] **AI character art** (Requires backend)
- [ ] **AI Chat with characters** (Needs backend, auth, API keys)
- [ ] **Scenario system** (Complex multi-character UI)
- [ ] **Cloud save/sync** (Needs auth + database)
- [ ] **Manual creation flow** (Multi-step wizard UI)

---

## Legacy Roadmap Items (Pending / Deferred)

### Survey Results (Ranked by Popularity)
- [ ] Reduce US name bias (40%)
- [ ] Race/ethnicity-aware names
- [ ] Likes/dislikes (33.3%)
- [ ] Birthdays (must not conflict with age)
- [ ] Preferred weapons
- [ ] Religion / Ethnicity / Sexual orientation
- [ ] Expand plot hook variety (26.7%)
- [ ] Backstory generation (20%)
- [ ] Relationships between characters
- [ ] Job concepts

### Internal / Code-Level Tasks
- [ ] Deprecate V7 engine for V8 (server-based content)
- [ ] Consider single model per tag with archetype holding appropriate tags
- [ ] Replace appearance and wealth with treasure table system
- [ ] Implement bundled trait combos
- [ ] Re-enable Background section in `displayCharacter()`
- [ ] Populate `dist/` directory or remove it

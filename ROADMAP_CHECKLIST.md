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
- [ ] **Appearance System** (Skin, hair, eyes, physique, facial hair)
- [ ] **Palette generator** (Mapping personality traits to colors)
- [ ] **Clothing system** (fashion → outfit → flair → accessory)
- [ ] **Character concept generator** (adj+noun concept system)

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

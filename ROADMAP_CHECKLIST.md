# Roadmap Checklist

Based on [roadmap.html](roadmap.html) and survey results. Current version: **V7.4 (8 Aug 2023)**.

---

## Active Roadmap Items

- [ ] **Resources page** — Link to useful resources and credit contributors
- [ ] **Appearance generator** — Generate hair, skin, size, race, fashion, etc.
  - [ ] Decide generation order (personality → appearance, or appearance → personality)
  - [ ] Handle consistency with tropes (e.g. size dependent on story trope)
  - [ ] Handle setting variations (e.g. desert planet → darker skin)
- [ ] **Palette generator** — Generate a primary color based on personality
  - [ ] Map personality traits to colors (e.g. short-tempered → red, somber → purple/gray)
  - [ ] Generate complementary/secondary colors
  - [ ] Optionally generate skin color against the palette
  - [ ] Integrate with Lospec API for similar palette suggestions

---

## Survey Results (Ranked by Popularity)

### Appearance (100% requested)
- [ ] Hair color
- [ ] Eye color
- [ ] Skin color
- [ ] Body type
- [ ] Hair type
- [ ] Clothing
- [ ] Handle consistency challenges (trope-based biases)
- [ ] Handle setting-specific appearance
- [ ] Palette-first approach (personality → color → appearance)

### Name Generation (40% requested)
- [x] ~~Basic name generation~~ — Done (Moby Word List, Grady Ward)
- [ ] Reduce US name bias
- [ ] Race/ethnicity-aware names (depends on appearance/race system)

### More Depth (33.3% requested)
- [ ] Likes/dislikes
- [ ] Birthdays (must not conflict with age)
- [ ] Additional personality traits (must not conflict with wants)
- [ ] Preferred weapons
- [ ] Ethnicity
- [ ] Religion
- [ ] Sexual orientation

### More Plots (26.7% requested)
- [ ] Expand plot hook variety
- [ ] ChatGPT integration for plot expansion

### Back Story (20% requested)
- [ ] Backstory generation
- [ ] Explore non-AI approaches for generation

### Reduce Inconsistencies (20% requested)
- [ ] Engine tweaks to reduce trait conflicts
- [ ] Add "flag inconsistency" button for users

### Character Art (13.3% requested)
- [ ] Visual character representation
- [ ] Prerequisite: Appearance generator must be done first
- [ ] Evaluate AI art integration

### Miscellaneous (6.7% requested)
- [ ] Clearer results presentation
- [ ] Relationships between characters
- [ ] Job concepts
- [ ] Nonbinary gender options
- [ ] Magic system traits

---

## Deferred Items (Not in V7)

These are acknowledged good ideas but deferred due to engine complexity:

- [ ] **Moddability** — User-customizable content (planned after Appearances, Back Story, Palette)
- [ ] **Settings** — Genre/world setting support (solvable via moddable content)
- [ ] **Dialogue** — Generated character dialogue
- [ ] **World generator** — Planet, biomes, sci-fi, towns, shops
- [ ] **Fine control** — Lock/reroll specific traits, fill in own details
- [ ] **Combat** — Combat-related generation
- [ ] **First encounter writing prompt** — Low demand, hard without AI
- [ ] **Fictional languages**
- [ ] **Poetry**
- [ ] **Fandom generator**
- [ ] **Legacy versions** — Access to older generator versions

---

## Internal / Code-Level Tasks

Extracted from code comments and stubs:

- [ ] Flesh out stub want descriptions (`WGETJOBDONE`, `WRETURNHOME`, `WUPHOLDHONOR`, `WENEMIES`, `WCOLLECTION`, `WSMALLTHING`, `WFREEFROMBONDAGE`, `WSAVEDLIFE`, `WCHOSENONE`, `WENVY`, `WLOSTLOVE`, `WSPECIFICWEALTH`, `WSPECIFICJOB`, `WFAKEHEROISM`, `WFEAR`, `WBULLY`, `WFORCEDVILLAIN`, `WDISABLED`, `WBEHUMAN`, `WRESURRECT`, `WLUST`, `WSEERUINED`)
- [ ] Re-enable commented out `initWants()` entries once descriptions are written
- [ ] Deprecate V7 engine for V8 (server-based content, per `generator7.js` header comment)
- [ ] Consider single model per tag with archetype holding appropriate tags (per `tag-details.js` TODO)
- [ ] Replace appearance and wealth with treasure table system (per `tag-details.js` TODO)
- [ ] Implement bundled trait combos (e.g. sadist-violent-aggressive-moredakka)
- [ ] Re-enable Background section in `displayCharacter()` (currently commented out)
- [ ] Populate `dist/` directory or remove it

# PRD — Palette Generator & Portrait Header (V7.5)

**Status:** Ready to build
**Tier:** V7.5 / Tier 2 (offline expansion, no backend)
**Depends on:** the uncommitted appearance system (`js/appearance-details.js`)

---

## 1. Summary

Add a **color palette** to each generated character and surface it as the
character's **portrait**: a small square (the palette rendered as a pie chart)
sitting to the left of the name and key physical stats, forming a portrait
header card at the top of the character sheet. Ships fully client-side, no
dependency additions, no backend.

The palette generator is ported from the Bolt prototype
(`bolt-random-character/utils/colors.ts`) but rewritten to be dependency-free.

## 2. Goals

- Every generated character gets a harmonious color palette.
- The palette renders as a **pie chart** (wedges sized by usage ratio),
  matching the reference image (dominant + supporting + accent colors).
- The pie **is the character portrait** — it fills the square in a new header
  card. No AI art, no silhouette.
- The header card shows **name + Eyes / Hair / Skin / Build** beside the square.
- Works on mobile: portrait stays **side-by-side** with stats, square shrinks.

## 3. Non-goals (explicitly deferred)

- **Trait → color mapping.** Palette is random-first this pass. Mapping
  personality tags to color families is a committed *follow-up*, not part of
  this work.
- **AI character art / silhouettes.** The square is the pie, nothing else.
- **Clothing / wardrobe colors.** Separate Tier-2 item.
- **UI theming from the palette** (re-coloring the card/page). Later.

## 4. Design decisions (resolved)

| # | Decision | Choice |
|---|----------|--------|
| Dependency | How to handle `chroma-js` | **Rewrite** the ~4 chroma calls (hsl→hex, hex→lab, hex→hsl) in ~40 lines of vanilla color math. No new dependency. Keep the LAB/ΔE quality gates. |
| Trait link | Random vs trait-driven | **Random-first** (Bolt's `generateCharacterPalette()` as-is). Trait mapping is a follow-up. |
| Render | Pie vs swatches | **Pie chart** (SVG arc, wedges = `usageRatio`). |
| Palette size/harmony | Which harmonies | **Full random harmony** minus `2bit` (complementary / triadic / split-complementary / analogous). |
| Placement | Where the pie lives | **The pie IS the portrait square** in the header card. No separate section. |
| Header layout | Card shape | Rebuild `sheet-header` into: **square left, name + stat grid right.** |
| Mobile | Stack vs side-by-side | **Side-by-side always**, square shrinks to ~64–72px, stats collapse to one column. Fallback to stacking only if wedges look muddy. |
| Stat fields | Which stats | **Eyes, Hair, Skin, Build.** (Not Role/Gender — those appear elsewhere.) |
| Stat source | Sentence vs value | **Restructure appearance rules** to carry a short `value` alongside the sentence (single source of truth). |
| Section overlap | Repetition | Header fields' sentences **suppressed** in the Appearance section. Section keeps grooming, facial hair, and physique *flavor*. Build shows in header AND its flavor sentence stays in section. |
| Detail gating | When it rolls | **Palette + the 4 appearance values always roll**, any detail level. Detail level gates only the prose sections. |
| Empty state | Load / low detail | **First load:** plain name header, no square. **Post-generation:** full card at any detail level. |

## 5. Implementation

### 5.1 Palette engine — new file `js/palette-details.js`

Port from `bolt-random-character/utils/colors.ts`:

- Keep: hue-band selection, gaudy-zone avoidance, harmony generators
  (complementary / triadic / split-complementary / analogous), triplet
  proportions, LAB ΔE + lightness-contrast quality gates.
- Drop: `chroma-js`. Replace its 3 operations with vanilla helpers:
  - `hslToHex(h, s, l)`
  - `hexToLab(hex)` (via hex→rgb→xyz→lab)
  - `hexToHsl(hex)`
- Drop: TypeScript types, `export`, `2bit` generator, custom-role generators
  (not needed — no manual color picking this pass).
- Public entry: `generatePalette()` → returns
  `{ colors: [{ role, color, usageRatio }], harmony }`.
- Use the existing `roll()` / `randomArray()` helpers where natural; keep the
  file self-contained like `appearance-details.js`.

### 5.2 Appearance rules — `js/appearance-details.js`

- Add a short `value` to each rule (e.g. `{ name:'hazel', value:'hazel',
  weight:3, texts:[...] }`) for skin, hair, eye, physique rules.
- Expose the rolled values so the header can read Eyes / Hair / Skin / Build.
- `generateAppearance()` gains a way to return **both** the header values and
  the section sentences, with header-field sentences omitted from the section
  output (physique flavor sentence retained).

### 5.3 Pie chart renderer

- Vanilla function: palette → inline `<svg>` with one `<path>` wedge per color,
  arc-swept by `usageRatio`. ~35 lines of arc math. No library.
- Sized to fill the header square; scales via `width`/`height` on the SVG.

### 5.4 Header card — `index.html` + `css/main.css`

- Rebuild `sheet-header` (currently name-only `<h2 id="display-name">`) into a
  flex card: square (pie) on the left, `#display-name` + a 4-field stat grid on
  the right.
- CSS: flex row, square `flex-shrink` to ~64–72px on narrow viewports, stat
  grid collapses to one column on mobile.
- Card hidden on first load; shown after first generation.

### 5.5 Wiring — `js/generator7.js`

- In `displayCharacter()`: always generate a palette, render the pie into the
  square, populate the stat grid from appearance values, reveal the card.
- Load `js/palette-details.js` via `<script>` in `index.html` (next to
  `appearance-details.js`).

## 6. Acceptance criteria

- [ ] Generating a character shows a portrait card: pie square + name + Eyes /
      Hair / Skin / Build.
- [ ] Pie wedges are proportional to `usageRatio` and use harmonious colors.
- [ ] No `chroma-js` / no new dependency; page still loads with only
      jQuery + Ramda.
- [ ] Eye/hair/skin/build values in the header match the Appearance section
      (no contradiction) and are **not** repeated as sentences in the section.
- [ ] Palette + the 4 stat values appear at **every** detail level, including
      Sparse.
- [ ] First page load shows the plain name header (no empty square).
- [ ] Layout holds at desktop and ~375px mobile widths, square side-by-side
      with stats.

## 7. Verification

Browser-drive the generator: produce several characters at multiple detail
levels, eyeball the pie + header at **desktop and ~375px mobile** widths before
calling it done. Confirm no eye/hair/skin/build repetition between header and
section.

## 8. Commit plan

1. **Commit the existing appearance system first** (`js/appearance-details.js`
   + its wiring), so the palette/portrait work lands as a clean isolated diff.
2. Build palette + portrait header as the following change.

## 9. Open follow-ups (post-ship)

- Trait → color mapping (`tag → ColorFamily`/`baseHue`), the roadmap's actual
  "map personality traits to colors" ask.
- Revisit mobile pie legibility; stack if 64px wedges read muddy.

// V7.5 Tier 2: Appearance system (skin, hair, eyes, physique, facial hair).
// Two layers: colors roll freely; body/style rules are tag-aware so they
// can't contradict personality tags (TBIG, TSMALL, TCLASSY, TNERD...).
// Generic rules engine — clothing and palette systems will reuse rollRules().

// A rule: { name, weight, requires: [tags], excludes: [tags], adds: [tags], texts: [strings-or-fns] }
function rollRules(rules, tags) {
  const valid = rules.filter(r =>
    (r.requires || []).every(t => tags.has(t)) &&
    !(r.excludes || []).some(t => tags.has(t)));
  if (!valid.length) return null;
  let n = roll(1, valid.reduce((s, r) => s + r.weight, 0));
  for (const r of valid) {
    n -= r.weight;
    if (n <= 0) return r;
  }
  return valid[valid.length - 1];
}

// Internal appearance tags (adds), used only for coherence between rolls
const ATOWERING = 'a-towering';
const ADELICATE = 'a-delicate';
const AGROOMED = 'a-groomed';
const ASCRUFFY = 'a-scruffy';

// Color-pinning tags, set by aspects rather than by the appearance roll. A trope
// that names a color outright (a Fiery Redhead whose hair isn't red isn't the
// trope) sets one of these; the matching rule's `forcedBy` then wins the layer.
// Aspects that pin the same layer must exclude each other's tag — see the color
// tropes in generator7.js's initAspects().
const AHAIRRED = 'a-hair-red';
const AHAIRBLOND = 'a-hair-blond';
const AHAIRBLACK = 'a-hair-black';
const AHAIRGRAY = 'a-hair-gray';
const ASKINPALE = 'a-skin-pale';
const AEYESBLUE = 'a-eyes-blue';
const AEYESRED = 'a-eyes-red';

// Skin/hair/eye/physique rules carry a short `value` (single source of truth)
// so the portrait header can show Eyes / Hair / Skin / Build without re-deriving
// them from the prose sentence.
//
// Color rules may carry a palette seed, which rollAppearance() may pick to steer
// the character's palette (see pickSeed below). Two kinds:
//   `hue` (0-360)     a chromatic color: red hair drives a red palette
//   `family`          an achromatic one: black hair drives a charcoal scheme
//                     (a NEUTRAL_FAMILIES key in palette-details.js)
// A rule with neither contributes nothing and leaves the palette random — that's
// dyed hair (no fixed color) and mismatched eyes (not one color). Skin stays
// seedless across the board: the tones cluster in a narrow low-chroma warm band
// that makes for dull seeds, and letting every pale character drive an ivory
// palette would wash out a good fraction of the cast. So Raven Hair, Ivory Skin
// steers the palette through its *hair* pin, and its skin pin is header-only.
//
// A rule may also carry `forcedBy`: the tag an aspect sets to pin this color.
// When that tag is present the rule skips the weighted roll entirely, and the
// color it pins wins the palette seed (see pickSeed).
function skinRules() {
  return [
    { name: 'pale', value: 'Pale', weight: 3, forcedBy: ASKINPALE, texts: [`${p.She} has pale skin that burns before it tans.`] },
    { name: 'fair', value: 'Fair', weight: 4, texts: [`${p.She} has fair, freckled skin.`, `${p.She} has a fair complexion.`] },
    { name: 'olive', value: 'Olive', weight: 4, texts: [`${p.She} has an olive complexion.`] },
    { name: 'tan', value: 'Tan', weight: 4, texts: [`${p.She} has tan, sun-weathered skin.`, `${p.She} has a warm bronze complexion.`] },
    { name: 'brown', value: 'Brown', weight: 4, texts: [`${p.She} has brown skin.`, `${p.She} has a deep copper complexion.`] },
    { name: 'dark', value: 'Dark', weight: 3, texts: [`${p.She} has dark, cool-toned skin.`] },
  ];
}

function hairRules() {
  return [
    { name: 'black', value: 'Black', weight: 5, family: 'black', forcedBy: AHAIRBLACK, texts: [`${p.His} hair is black.`, `${p.His} hair is so black it shines blue in the light.`] },
    { name: 'brown', value: 'Brown', weight: 5, hue: 28, texts: [`${p.His} hair is brown.`, `${p.His} hair is a dark chestnut.`] },
    { name: 'blond', value: 'Blond', weight: 3, hue: 45, forcedBy: AHAIRBLOND, texts: [`${p.His} hair is blond.`, `${p.His} hair is a pale straw color.`] },
    { name: 'red', value: 'Red', weight: 2, hue: 15, forcedBy: AHAIRRED, texts: [`${p.His} hair is copper-red.`] },
    { name: 'gray', value: 'Gray', weight: 2, family: 'gray', forcedBy: AHAIRGRAY, texts: [`${p.His} hair is going gray at the temples.`, `${p.His} hair is fully silver, whatever ${p.his} age.`] },
    { name: 'dyed', value: 'Dyed', weight: 1, texts: [`${p.His} hair is dyed a color found nowhere in nature.`] },
  ];
}

function eyeRules() {
  return [
    { name: 'brown', value: 'Brown', weight: 6, hue: 30, texts: [`${p.His} eyes are brown.`, `${p.His} eyes are so dark the pupil disappears.`] },
    { name: 'hazel', value: 'Hazel', weight: 3, hue: 40, texts: [`${p.His} eyes are hazel, shifting color with the light.`] },
    { name: 'green', value: 'Green', weight: 2, hue: 120, texts: [`${p.His} eyes are green.`] },
    { name: 'blue', value: 'Blue', weight: 3, hue: 210, forcedBy: AEYESBLUE, texts: [`${p.His} eyes are blue.`, `${p.His} eyes are a washed-out gray-blue.`] },
    { name: 'mismatched', value: 'Mismatched', weight: 1, texts: [`${p.His} eyes are two different colors, which people notice a moment too late to be polite about.`] },
    // Red eyes only exist when a trope pins them: `requires` keeps them out of
    // the ordinary roll, so nobody gets them by accident.
    { name: 'red', value: 'Red', weight: 1, hue: 355, requires: [AEYESRED], forcedBy: AEYESRED, texts: [`${p.His} eyes are red, and people find reasons to look elsewhere.`] },
  ];
}

function physiqueRules() {
  return [
    { name: 'towering', value: 'Towering', weight: 3, requires: [TBIG], adds: [ATOWERING], texts: [`${p.She} fills doorways and is used to ducking through them.`] },
    { name: 'heavyset', value: 'Heavyset', weight: 2, excludes: [TSMALL], texts: [`${p.She} is heavyset, solid rather than soft.`] },
    { name: 'wiry', value: 'Wiry', weight: 3, excludes: [TBIG], texts: [`${p.She} is wiry, all tendon and quick movement.`] },
    { name: 'compact', value: 'Compact', weight: 3, requires: [TSMALL], adds: [ADELICATE], texts: [`${p.She} is small enough to be underestimated, and uses it.`] },
    { name: 'average', value: 'Average', weight: 4, excludes: [TBIG, TSMALL], texts: [`${p.She} has an unremarkable build that witnesses struggle to describe.`] },
    { name: 'athletic', value: 'Athletic', weight: 3, excludes: [TNERD], texts: [`${p.She} moves like someone who trains daily.`] },
  ];
}

function groomingRules() {
  return [
    { name: 'immaculate', weight: 3, requires: [TCLASSY], adds: [AGROOMED], texts: [`Not a hair out of place, ever. It looks effortless and isn't.`] },
    { name: 'neat', weight: 4, excludes: [TNERD], adds: [AGROOMED], texts: [`${p.She} keeps ${p.herself} tidy without fussing over it.`] },
    { name: 'practical', weight: 4, texts: [`${p.His} hair is cut or tied for convenience, not fashion.`] },
    { name: 'unkempt', weight: 3, excludes: [TCLASSY, TSEXY], adds: [ASCRUFFY], texts: [`${p.She} looks like ${p.she} slept in ${p.his} clothes, and possibly did.`] },
  ];
}

function facialHairRules() {
  return [
    { name: 'clean', weight: 4, requires: [TMALE], texts: [`${p.She} is clean-shaven.`] },
    { name: 'stubble', weight: 3, requires: [TMALE], excludes: [AGROOMED], texts: [`${p.She} wears a few days of stubble.`] },
    { name: 'beard', weight: 3, requires: [TMALE], texts: [`${p.She} keeps a full beard.`] },
    { name: 'mustache', weight: 1, requires: [TMALE], excludes: [ASCRUFFY], texts: [`${p.She} maintains a mustache with visible pride.`] },
  ];
}

// A rule's palette seed, or null when it has none (dyed hair, mismatched eyes,
// every skin tone). `hue` and `family` are mutually exclusive.
function ruleSeed(rule) {
  if (typeof rule.hue === 'number') return { hue: rule.hue };
  if (rule.family) return { family: rule.family };
  return null;
}

// A trope that names a color pins the matching rule, skipping the weighted roll.
// Returns null when this layer isn't pinned. Rules without `forcedBy` are never
// pinnable, so layers that no trope names behave exactly as before.
function forcedRule(rules, tags) {
  return rules.find(r => r.forcedBy && tags.has(r.forcedBy)) || null;
}

// From the rolled color features that carry a seed, pick one to steer the palette
// (or null if none did this run — then the palette stays fully random). This is
// what "tie a physical color into the palette" means: the character's own
// coloring drives it. Black hair yields { family: 'black' }, red hair { hue: 15 }.
//
// A pinned color wins outright. Fiery Redhead named the red, so seeding off her
// blue eyes instead would contradict the trope that just rolled. Unpinned colors
// keep the random pick among themselves.
function pickSeed(rolled) {
  const seeded = rolled.filter(r => r.seed);
  if (!seeded.length) return null;
  const pinned = seeded.filter(r => r.pinned);
  const pool = pinned.length ? pinned : seeded;
  return pool[roll(1, pool.length) - 1].seed;
}

// Rolls the full appearance and returns:
//   values:  { eyes, hair, skin, build }        — for the portrait header
//   lines:   [sentence, ...]                    — for the Appearance section
//   seed:    { hue } | { family } | null        — the pick among appearance-only
//            candidates (kept for callers that don't roll clothing)
//   seedCandidates: [{ seed, pinned }, ...]     — raw candidates, so the caller
//            can pool them with the clothing system's before running pickSeed()
//   tags:    Set — charTags plus this roll's adds (a-groomed, facial_hair_*...),
//            consumed by the clothing and concept systems downstream
// Eye/hair/skin sentences are suppressed from `lines` (they already show in the
// header); physique keeps its flavor sentence, and grooming + facial hair always
// appear in the section.
function rollAppearance(charTags) {
  const tags = new Set(charTags);
  const values = {};
  const lines = [];
  const colorRolls = [];
  const layers = [
    { rules: skinRules(), key: 'skin', inSection: false, color: true },
    { rules: hairRules(), key: 'hair', inSection: false, color: true },
    { rules: eyeRules(), key: 'eyes', inSection: false, color: true },
    { rules: physiqueRules(), key: 'build', inSection: true },
    { rules: groomingRules(), key: null, inSection: true },
    { rules: facialHairRules(), key: null, inSection: true },
  ];
  layers.forEach(function (layer) {
    const forced = forcedRule(layer.rules, tags);
    const r = forced || rollRules(layer.rules, tags);
    if (!r) return;
    (r.adds || []).forEach(t => tags.add(t));
    if (layer.key) values[layer.key] = r.value;
    if (layer.color) colorRolls.push({ seed: ruleSeed(r), pinned: !!forced });
    if (layer.inSection) lines.push(randomArray(r.texts));
  });
  return { values: values, lines: lines, seed: pickSeed(colorRolls), seedCandidates: colorRolls, tags: tags };
}

// Back-compat: array of appearance sentences only (header suppression applied).
function generateAppearance(charTags) {
  return rollAppearance(charTags).lines;
}

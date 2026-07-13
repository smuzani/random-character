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

// Skin/hair/eye/physique rules carry a short `value` (single source of truth)
// so the portrait header can show Eyes / Hair / Skin / Build without re-deriving
// them from the prose sentence.
function skinRules() {
  return [
    { name: 'pale', value: 'Pale', weight: 3, texts: [`${p.She} has pale skin that burns before it tans.`] },
    { name: 'fair', value: 'Fair', weight: 4, texts: [`${p.She} has fair, freckled skin.`, `${p.She} has a fair complexion.`] },
    { name: 'olive', value: 'Olive', weight: 4, texts: [`${p.She} has an olive complexion.`] },
    { name: 'tan', value: 'Tan', weight: 4, texts: [`${p.She} has tan, sun-weathered skin.`, `${p.She} has a warm bronze complexion.`] },
    { name: 'brown', value: 'Brown', weight: 4, texts: [`${p.She} has brown skin.`, `${p.She} has a deep copper complexion.`] },
    { name: 'dark', value: 'Dark', weight: 3, texts: [`${p.She} has dark, cool-toned skin.`] },
  ];
}

function hairRules() {
  return [
    { name: 'black', value: 'Black', weight: 5, texts: [`${p.His} hair is black.`, `${p.His} hair is so black it shines blue in the light.`] },
    { name: 'brown', value: 'Brown', weight: 5, texts: [`${p.His} hair is brown.`, `${p.His} hair is a dark chestnut.`] },
    { name: 'blond', value: 'Blond', weight: 3, texts: [`${p.His} hair is blond.`, `${p.His} hair is a pale straw color.`] },
    { name: 'red', value: 'Red', weight: 2, texts: [`${p.His} hair is copper-red.`] },
    { name: 'gray', value: 'Gray', weight: 2, texts: [`${p.His} hair is going gray at the temples.`, `${p.His} hair is fully silver, whatever ${p.his} age.`] },
    { name: 'dyed', value: 'Dyed', weight: 1, texts: [`${p.His} hair is dyed a color found nowhere in nature.`] },
  ];
}

function eyeRules() {
  return [
    { name: 'brown', value: 'Brown', weight: 6, texts: [`${p.His} eyes are brown.`, `${p.His} eyes are so dark the pupil disappears.`] },
    { name: 'hazel', value: 'Hazel', weight: 3, texts: [`${p.His} eyes are hazel, shifting color with the light.`] },
    { name: 'green', value: 'Green', weight: 2, texts: [`${p.His} eyes are green.`] },
    { name: 'blue', value: 'Blue', weight: 3, texts: [`${p.His} eyes are blue.`, `${p.His} eyes are a washed-out gray-blue.`] },
    { name: 'mismatched', value: 'Mismatched', weight: 1, texts: [`${p.His} eyes are two different colors, which people notice a moment too late to be polite about.`] },
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

// Rolls the full appearance and returns both:
//   values: { eyes, hair, skin, build }  — for the portrait header
//   lines:  [sentence, ...]              — for the Appearance section
// Eye/hair/skin sentences are suppressed from `lines` (they already show in the
// header); physique keeps its flavor sentence, and grooming + facial hair always
// appear in the section.
function rollAppearance(charTags) {
  const tags = new Set(charTags);
  const values = {};
  const lines = [];
  const layers = [
    { rules: skinRules(), key: 'skin', inSection: false },
    { rules: hairRules(), key: 'hair', inSection: false },
    { rules: eyeRules(), key: 'eyes', inSection: false },
    { rules: physiqueRules(), key: 'build', inSection: true },
    { rules: groomingRules(), key: null, inSection: true },
    { rules: facialHairRules(), key: null, inSection: true },
  ];
  layers.forEach(function (layer) {
    const r = rollRules(layer.rules, tags);
    if (!r) return;
    (r.adds || []).forEach(t => tags.add(t));
    if (layer.key) values[layer.key] = r.value;
    if (layer.inSection) lines.push(randomArray(r.texts));
  });
  return { values: values, lines: lines };
}

// Back-compat: array of appearance sentences only (header suppression applied).
function generateAppearance(charTags) {
  return rollAppearance(charTags).lines;
}

// V7.5 Tier 2: Palette generator + portrait pie renderer.
// Ported from the Bolt prototype (utils/colors.ts), rewritten dependency-free:
// chroma-js's hsl->hex, hex->lab, hex->hsl are replaced with vanilla color math.
// Dropped: 2bit harmony, custom-role generators, TS types. Random-first; trait
// -> color mapping is a committed follow-up, not part of this pass.
//
// Public entry:
//   generatePalette() -> { colors: [{ role, color, usageRatio }], harmony }
//   palettePieSvg(palette, size) -> inline <svg> string (the portrait square)

// --- color math (replaces chroma-js) --------------------------------

// h in [0,360), s/l in [0,100]. Returns "#rrggbb".
function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  const toHex = v => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Returns [h(0-360), s(0-100), l(0-100)].
function hexToHsl(hex) {
  let [r, g, b] = hexToRgb(hex).map(v => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

// Returns CIE L*a*b* as [L, a, b] (D65). hex -> rgb -> xyz -> lab.
function hexToLab(hex) {
  let [r, g, b] = hexToRgb(hex).map(v => {
    v /= 255;
    return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
  });
  // sRGB -> XYZ (D65)
  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  x = f(x); y = f(y); z = f(z);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

// --- randomness (leans on the generator's roll(), stays self-contained) ---

function rnd(a, b) {
  return Math.random() * (b - a) + a;
}
function rndInt(a, b) {
  return (typeof roll === 'function') ? roll(a, b) : Math.floor(Math.random() * (b - a + 1)) + a;
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// --- palette tuning (from Bolt) -------------------------------------

const SATURATION_RANGE = [45, 85];
const LIGHTNESS_RANGE = [35, 78];

// Neutral families. Ported back from Bolt's ColorFamily 'black'/'white', which
// the first pass dropped by accident: they were entangled with the user-picked
// -family feature the PRD cut, so cutting that cut these too, leaving the engine
// unable to emit any gray, black or white at all.
//
// A neutral family drives the *whole* triplet rather than contributing one
// swatch: every member goes desaturated and shares a lightness band, so black
// reads as a charcoal scheme rather than one black wedge among colors. Hue is
// near-meaningless at this saturation, so the generators roll it freely.
//
// The gates have to relax to match — three near-grays are legitimately similar,
// and the chromatic thresholds (ΔE 12 / ΔL 20) would reject every one of them.
// `gray` is ours; Bolt had only black and white, and silver hair needs a mid
// band that neither covers.
const NEUTRAL_FAMILIES = {
  black: { sat: [0, 20], light: [8, 35], deltaE: 6, dLight: 8 },
  gray: { sat: [0, 20], light: [35, 70], deltaE: 6, dLight: 8 },
  white: { sat: [0, 25], light: [70, 98], deltaE: 3, dLight: 4 },
};

// Gaudy hue bands to steer away from (yellow-green goblin zone etc.)
const GAUDY_HUE_BANDS = [[60, 95], [330, 360], [40, 80]];
const NEUTRAL_HSL = { h: 210, s: 15, l: 50 };

// Hue bands per color family; excludes the 60-95 yellow-green zone.
const FAMILY_BANDS = [
  [345, 360], [0, 15],   // red
  [20, 35],              // orange
  [40, 55],              // yellow
  [100, 150],            // green
  [160, 190],            // cyan
  [200, 250],            // blue
  [260, 300],            // purple
  [305, 340],            // magenta
];

function randomFromBands(bands) {
  const total = bands.reduce((sum, [s, e]) => sum + (e - s + 1), 0);
  let r = Math.random() * total;
  for (const [s, e] of bands) {
    const len = e - s + 1;
    if (r < len) return s + Math.floor(r);
    r -= len;
  }
  return bands[0][0];
}

function weightedRandomHue() {
  return randomFromBands(FAMILY_BANDS);
}

function neutralize(h, s, v) {
  const gaudy = GAUDY_HUE_BANDS.some(([s0, e0]) => h >= s0 && h <= e0);
  if (gaudy) {
    const bf = 0.15;
    h = lerp(h, NEUTRAL_HSL.h, bf);
    s = lerp(s, NEUTRAL_HSL.s, bf);
    v = lerp(v, NEUTRAL_HSL.l, bf);
  }
  return [h, s, v];
}

function deltaE(a, b) {
  return Math.sqrt(
    Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2) + Math.pow(b[2] - a[2], 2));
}

// --- triplet factory ------------------------------------------------

function randomTripleProportions() {
  const pPrimary = rnd(0.52, 0.72);
  const remainder = 1 - pPrimary;
  const pA = rnd(0.20 * remainder, 0.80 * remainder);
  const pB = 1 - pPrimary - pA;
  const round2 = x => Math.round(x * 100) / 100;
  const a = round2(pPrimary), b = round2(pA);
  return [a, b, Math.round((1 - a - b) * 100) / 100];
}

function valueTriplet() {
  const domV = rnd(40, 60);
  let highV, lowV;
  if (rndInt(0, 1) === 0) { highV = rnd(70, 85); lowV = rnd(20, 35); }
  else { highV = rnd(20, 35); lowV = rnd(70, 85); }
  return [domV, highV, lowV];
}

// Builds a validated 3-color triplet from hues, or null if quality gates fail.
// `family` names a NEUTRAL_FAMILIES key to force a desaturated scheme; omit it
// for the ordinary chromatic path.
function makeTriplet(hues, family) {
  let [domH, supAH, supBH] = hues;
  const neutral = NEUTRAL_FAMILIES[family];

  let domS, supAS, supBS, domV, supAV, supBV;
  if (neutral) {
    // Every member desaturated and inside one lightness band — the scheme *is*
    // the neutral, so there's no dominant/support value pattern to assign.
    domS = rnd(neutral.sat[0], neutral.sat[1]);
    supAS = rnd(neutral.sat[0], neutral.sat[1]);
    supBS = rnd(neutral.sat[0], neutral.sat[1]);
    domV = rnd(neutral.light[0], neutral.light[1]);
    supAV = rnd(neutral.light[0], neutral.light[1]);
    supBV = rnd(neutral.light[0], neutral.light[1]);
  } else {
    domS = rnd(40, 70); supAS = rnd(25, 55); supBS = rnd(25, 55);
    [domV, supAV, supBV] = valueTriplet();

    // Neutral-blend the worst zone (yellow-green 60-95). Pointless for a neutral
    // family — already desaturated — so it's skipped there.
    const cols = [[domH, domS, domV], [supAH, supAS, supAV], [supBH, supBS, supBV]];
    for (let i = 0; i < cols.length; i++) {
      let [h, s, v] = cols[i];
      if (h >= 60 && h <= 95) [h, s, v] = neutralize(h, s, v);
      cols[i] = [h, s, v];
    }
    [domH, domS, domV] = cols[0];
    [supAH, supAS, supAV] = cols[1];
    [supBH, supBS, supBV] = cols[2];
  }

  const hexes = [hslToHex(domH, domS, domV), hslToHex(supAH, supAS, supAV), hslToHex(supBH, supBS, supBV)];
  const lab = hexes.map(hexToLab);
  const lights = [domV, supAV, supBV];

  // Quality gates: enough chroma distance and lightness contrast. Neutrals carry
  // their own thresholds — three charcoals are meant to be close.
  const eGate = neutral ? neutral.deltaE : 12;
  const lGate = neutral ? neutral.dLight : 20;
  if (Math.min(deltaE(lab[0], lab[1]), deltaE(lab[0], lab[2]), deltaE(lab[1], lab[2])) < eGate) {
    return null;
  }
  if (Math.min(
    Math.abs(lights[0] - lights[1]),
    Math.abs(lights[0] - lights[2]),
    Math.abs(lights[1] - lights[2])) < lGate) {
    return null;
  }
  // Reject "all screaming". Unreachable for neutrals, which cap saturation at 25.
  if (Math.max(domS, supAS, supBS) > 90 && Math.min(domS, supAS, supBS) > 70) {
    return null;
  }
  return hexes;
}

// --- harmony generators (3-color) -----------------------------------

const ROLES = ['Primary', 'Secondary', 'Accent'];

function tripletToPalette(hexes, harmony) {
  const props = randomTripleProportions();
  return {
    harmony: harmony,
    colors: hexes.map((color, i) => ({
      role: ROLES[i],
      color: color,
      usageRatio: Math.round(props[i] * 100),
    })),
  };
}

// Each generator takes an optional seed describing the character's coloring:
//   { hue: 0-360 }        a chromatic color (red hair, blue eyes) drives h1
//   { family: 'black' }   an achromatic color drives the whole scheme desaturated
//   null / undefined      fully random, as before
function seedHue(seed) {
  if (seed && typeof seed.hue === 'number') return ((seed.hue % 360) + 360) % 360;
  // A neutral has no meaningful hue below ~25% saturation, so let it roll free
  // across the whole wheel rather than through the chromatic bands.
  if (seed && NEUTRAL_FAMILIES[seed.family]) return rndInt(0, 359);
  return weightedRandomHue();
}

function seedFamily(seed) {
  return (seed && NEUTRAL_FAMILIES[seed.family]) ? seed.family : undefined;
}

function generateTriadic(seed) {
  const family = seedFamily(seed);
  for (let a = 0; a < 50; a++) {
    const h1 = seedHue(seed);
    const t = makeTriplet([h1, (h1 + 120) % 360, (h1 + 240) % 360], family);
    if (t) return tripletToPalette(t, 'triadic');
  }
  return null;
}

function generateSplitComplementary(seed) {
  const family = seedFamily(seed);
  for (let a = 0; a < 50; a++) {
    const h1 = seedHue(seed);
    const offset = rndInt(20, 35);
    const t = makeTriplet([h1, (h1 + 180 - offset) % 360, (h1 + 180 + offset) % 360], family);
    if (t) return tripletToPalette(t, 'splitComplementary');
  }
  return null;
}

function generateAnalogous(seed) {
  const family = seedFamily(seed);
  for (let a = 0; a < 50; a++) {
    const h1 = seedHue(seed);
    const t = makeTriplet([h1, (h1 + rndInt(15, 30)) % 360, (h1 - rndInt(15, 30) + 360) % 360], family);
    if (t) return tripletToPalette(t, 'analogous');
  }
  return null;
}

// Complementary is a guaranteed 2-color fallback (no quality gate to fail).
// Note: Bolt neutralized only the dominant here and left the complement fully
// saturated, which contradicts its own triadic/analogous (all-neutral). We keep
// the neutral consistent across every harmony instead.
function generateComplementary(seed) {
  const neutral = NEUTRAL_FAMILIES[seedFamily(seed)];
  const domH = seedHue(seed);
  const domS = neutral ? rnd(neutral.sat[0], neutral.sat[1]) : rnd(SATURATION_RANGE[0], SATURATION_RANGE[1]);
  const domV = neutral ? rnd(neutral.light[0], neutral.light[1]) : rnd(LIGHTNESS_RANGE[0], LIGHTNESS_RANGE[1]);
  const secH = (domH + 180 + rndInt(-20, 20)) % 360;
  const secS = neutral ? rnd(neutral.sat[0], neutral.sat[1]) : rnd(SATURATION_RANGE[0], SATURATION_RANGE[1]);
  // Split the neutral's own band so the two wedges stay tellable apart; the
  // chromatic path keeps its light/dark flip.
  let secV;
  if (neutral) {
    const mid = (neutral.light[0] + neutral.light[1]) / 2;
    secV = domV > mid ? rnd(neutral.light[0], mid) : rnd(mid, neutral.light[1]);
  } else {
    secV = domV > 50 ? rnd(30, 50) : rnd(60, 80);
  }
  const primaryRatio = rndInt(50, 90);
  return {
    harmony: 'complementary',
    colors: [
      { role: 'Primary', color: hslToHex(domH, domS, domV), usageRatio: primaryRatio },
      { role: 'Secondary', color: hslToHex(secH, secS, secV), usageRatio: 100 - primaryRatio },
    ],
  };
}

// When a physical color seeds the palette, it lands as the dominant (Primary)
// hue by construction. A coin-flip promotes it to the Accent role instead, so
// the character's eye/hair color is sometimes the big field and sometimes the
// pop — "randomly pick which becomes the primary or accent color."
function maybeSwapPrimaryAccent(palette) {
  const cols = palette.colors;
  if (cols.length < 3 || roll(1, 2) === 1) return palette;
  const prim = cols[0], acc = cols[2];
  const pRole = prim.role, aRole = acc.role;
  const pRatio = prim.usageRatio, aRatio = acc.usageRatio;
  prim.role = aRole; prim.usageRatio = aRatio;
  acc.role = pRole; acc.usageRatio = pRatio;
  return palette;
}

// Public entry: a harmonious palette, harmony chosen at random. `seed` describes
// the character's coloring — { hue } or { family } — and may be omitted for a
// fully random palette. Accepts a bare number as the old hue-only form.
function generatePalette(seed) {
  if (typeof seed === 'number') seed = { hue: seed };
  const seeded = !!(seed && (typeof seed.hue === 'number' || NEUTRAL_FAMILIES[seed.family]));
  const harmonies = ['complementary', 'triadic', 'splitComplementary', 'analogous'];
  const pick = harmonies[rndInt(0, harmonies.length - 1)];
  let palette;
  switch (pick) {
    case 'triadic': palette = generateTriadic(seed) || generateComplementary(seed); break;
    case 'splitComplementary': palette = generateSplitComplementary(seed) || generateComplementary(seed); break;
    case 'analogous': palette = generateAnalogous(seed) || generateComplementary(seed); break;
    case 'complementary':
    default: palette = generateComplementary(seed); break;
  }
  return seeded ? maybeSwapPrimaryAccent(palette) : palette;
}

// --- pie renderer (the portrait square) -----------------------------

// Point on a unit-ish circle, angle measured clockwise from 12 o'clock.
function pieCoord(cx, cy, r, fraction) {
  const angle = 2 * Math.PI * fraction - Math.PI / 2;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

// palette -> inline <svg> string. Wedges sized by usageRatio.
function palettePieSvg(palette, size) {
  size = size || 96;
  const cx = size / 2, cy = size / 2, r = size / 2;
  const total = palette.colors.reduce((s, c) => s + c.usageRatio, 0) || 1;
  let start = 0;
  let paths = '';
  palette.colors.forEach(function (c) {
    const frac = c.usageRatio / total;
    const end = start + frac;
    if (frac >= 0.9999) {
      // Single full-circle wedge: <path> arcs can't close a 360° sweep.
      paths += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + c.color + '"></circle>';
    } else {
      const [x0, y0] = pieCoord(cx, cy, r, start);
      const [x1, y1] = pieCoord(cx, cy, r, end);
      const large = frac > 0.5 ? 1 : 0;
      paths += '<path d="M' + cx + ',' + cy + ' L' + x0 + ',' + y0 +
        ' A' + r + ',' + r + ' 0 ' + large + ',1 ' + x1 + ',' + y1 +
        ' Z" fill="' + c.color + '"></path>';
    }
    start = end;
  });
  return '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size +
    '" role="img" aria-label="Character color palette portrait">' + paths + '</svg>';
}

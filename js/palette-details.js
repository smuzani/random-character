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
function makeTriplet(hues) {
  let [domH, supAH, supBH] = hues;
  let domS = rnd(40, 70), supAS = rnd(25, 55), supBS = rnd(25, 55);
  let [domV, supAV, supBV] = valueTriplet();

  // Neutral-blend the worst zone (yellow-green 60-95).
  const cols = [[domH, domS, domV], [supAH, supAS, supAV], [supBH, supBS, supBV]];
  for (let i = 0; i < cols.length; i++) {
    let [h, s, v] = cols[i];
    if (h >= 60 && h <= 95) [h, s, v] = neutralize(h, s, v);
    cols[i] = [h, s, v];
  }
  [domH, domS, domV] = cols[0];
  [supAH, supAS, supAV] = cols[1];
  [supBH, supBS, supBV] = cols[2];

  const hexes = [hslToHex(domH, domS, domV), hslToHex(supAH, supAS, supAV), hslToHex(supBH, supBS, supBV)];
  const lab = hexes.map(hexToLab);
  const lights = [domV, supAV, supBV];

  // Quality gates: enough chroma distance and lightness contrast.
  if (Math.min(deltaE(lab[0], lab[1]), deltaE(lab[0], lab[2]), deltaE(lab[1], lab[2])) < 12) {
    return null;
  }
  if (Math.min(
    Math.abs(lights[0] - lights[1]),
    Math.abs(lights[0] - lights[2]),
    Math.abs(lights[1] - lights[2])) < 20) {
    return null;
  }
  // Reject "all screaming".
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

// Each generator takes an optional baseHue: when the character's physical
// coloring supplies one, it drives h1 (the dominant hue) and the harmony is
// built around it; otherwise h1 is a random weighted hue as before.
function baseOrRandom(baseHue) {
  return (typeof baseHue === 'number') ? ((baseHue % 360) + 360) % 360 : weightedRandomHue();
}

function generateTriadic(baseHue) {
  for (let a = 0; a < 50; a++) {
    const h1 = baseOrRandom(baseHue);
    const t = makeTriplet([h1, (h1 + 120) % 360, (h1 + 240) % 360]);
    if (t) return tripletToPalette(t, 'triadic');
  }
  return null;
}

function generateSplitComplementary(baseHue) {
  for (let a = 0; a < 50; a++) {
    const h1 = baseOrRandom(baseHue);
    const offset = rndInt(20, 35);
    const t = makeTriplet([h1, (h1 + 180 - offset) % 360, (h1 + 180 + offset) % 360]);
    if (t) return tripletToPalette(t, 'splitComplementary');
  }
  return null;
}

function generateAnalogous(baseHue) {
  for (let a = 0; a < 50; a++) {
    const h1 = baseOrRandom(baseHue);
    const t = makeTriplet([h1, (h1 + rndInt(15, 30)) % 360, (h1 - rndInt(15, 30) + 360) % 360]);
    if (t) return tripletToPalette(t, 'analogous');
  }
  return null;
}

// Complementary is a guaranteed 2-color fallback (no quality gate to fail).
function generateComplementary(baseHue) {
  const domH = baseOrRandom(baseHue);
  const domS = rnd(SATURATION_RANGE[0], SATURATION_RANGE[1]);
  const domV = rnd(LIGHTNESS_RANGE[0], LIGHTNESS_RANGE[1]);
  const secH = (domH + 180 + rndInt(-20, 20)) % 360;
  const secS = rnd(SATURATION_RANGE[0], SATURATION_RANGE[1]);
  const secV = domV > 50 ? rnd(30, 50) : rnd(60, 80);
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

// Public entry: a harmonious palette, harmony chosen at random. An optional
// baseHue (0-360) seeds the dominant hue from the character's physical coloring;
// omit it for a fully random palette.
function generatePalette(baseHue) {
  const seeded = typeof baseHue === 'number';
  const harmonies = ['complementary', 'triadic', 'splitComplementary', 'analogous'];
  const pick = harmonies[rndInt(0, harmonies.length - 1)];
  let palette;
  switch (pick) {
    case 'triadic': palette = generateTriadic(baseHue) || generateComplementary(baseHue); break;
    case 'splitComplementary': palette = generateSplitComplementary(baseHue) || generateComplementary(baseHue); break;
    case 'analogous': palette = generateAnalogous(baseHue) || generateComplementary(baseHue); break;
    case 'complementary':
    default: palette = generateComplementary(baseHue); break;
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

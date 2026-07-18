/**
 * @fileoverview Roll-lab core. Sits on top of the bundled V7 engine and talks
 * to it only through pure seams (branchesForDetail, generateCharacter,
 * resolveCharacter, characterSections). No DOM. If the engine is rewritten,
 * this file is the contract the new engine must satisfy: buildCharacter(opts)
 * returns a plain data object; everything downstream (Node printer, lab page)
 * renders from that.
 */

"use strict";

// Deterministic RNG. The engine rolls through Math.random (roll(), palette),
// so swapping it for the duration of one build makes the whole pipeline —
// personality, plot, appearance, clothing, concept, palette — reproducible
// from a single integer seed.
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function withSeed(seed, fn) {
  const real = Math.random;
  Math.random = mulberry32(seed);
  try { return fn(); } finally { Math.random = real; }
}

// Mirrors loadTags()/loadInitialBranches() without the form. opts:
//   seed:    integer (required — every roll is reproducible)
//   role:    'any' | 'hero' | 'villain' | 'support'
//   gender:  'any' | 'male' | 'female'
//   detail:  'sparse' | 'moderate' | 'high' | 'very-high'
//   noStereotypes: boolean (skips gender tags, they/them pronouns)
//   name:    optional fixed name
function buildCharacter(opts) {
  return withSeed(opts.seed, function () {
    const ROLE_TAGS = { hero: TFACE, villain: THEEL, support: TSUPPORT };

    const tags = [];
    tags.push(ROLE_TAGS[opts.role] || forceRole());

    let gender = '';
    if (!opts.noStereotypes) {
      gender = opts.gender === 'male' ? TMALE
        : opts.gender === 'female' ? TFEMALE
        : forceGender();
      tags.push(gender);
    }
    const name = opts.name || randomName(gender);
    generatePronouns(gender, name);

    const c = new Character(tags, branchesForDetail('detail-' + (opts.detail || 'high')));
    generateCharacter(c);
    resolveCharacter(c);

    return {
      seed: opts.seed,
      opts: opts,
      name: p.Sdesc,
      concept: c.concept,
      stats: c.appearance.values,
      paletteSeed: c.paletteSeed,
      outfit: c.clothing ? c.clothing.outfit : null,
      styleLines: c.clothing ? c.clothing.lines.slice() : [],
      aspects: c.aspects.map(function (a) { return { name: a.name, type: a.type }; }),
      teamType: c.teamType ? c.teamType.name : null,
      tags: Array.from(c.tags).filter(Boolean),
      sections: characterSections(c)
    };
  });
}

// Site display order: Physical, Style, Motivation, Plot Hook, Portrayal,
// Strengths & Weaknesses, Private Details, Wealth.
const LAB_SECTION_ORDER = [
  ['appearance', 'Physical Attributes', 'list'],
  ['want', 'Motivation', 'para'],
  ['plot', 'Plot Hook', 'para'],
  ['portrayal', 'Portrayal', 'list'],
  ['power', 'Strengths & Weaknesses', 'list'],
  ['personal', 'Private Details', 'list'],
  ['wealth', 'Wealth / Equipment', 'list']
];

// Plain-text sheet for terminal reading and diffable fixtures.
// opts.src appends ⟨bank:tag←via⟩ provenance to every line.
function renderCharacterText(data, opts) {
  opts = opts || {};
  const out = [];
  const srcOf = function (l) {
    if (!opts.src) return '';
    const s = l.src || {};
    let mark = s.bank || '?';
    if (s.tag) mark += ':' + s.tag;
    if (s.via) mark += '←' + s.via;
    return '  ⟨' + mark + '⟩';
  };

  out.push('=== ' + data.name.toUpperCase() + ' — ' + (data.concept || '(no concept)') +
    '  [seed ' + data.seed + ' ' + (data.opts.role || 'any') + '/' + (data.opts.detail || 'high') + ']');
  const st = data.stats || {};
  out.push('    eyes ' + (st.eyes || '—') + ' | hair ' + (st.hair || '—') +
    ' | skin ' + (st.skin || '—') + ' | build ' + (st.build || '—') +
    (data.outfit ? ' | outfit ' + data.outfit : ''));
  out.push('    tropes: ' + data.aspects.map(function (a) { return a.name; }).join(', '));

  LAB_SECTION_ORDER.forEach(function (def) {
    const key = def[0], title = def[1], mode = def[2];
    const lines = (data.sections[key] || []);
    if (!lines.length) return;
    out.push('  ' + title.toUpperCase());
    if (mode === 'para') {
      lines.forEach(function (l) { out.push('    ' + l.text + srcOf(l)); });
    } else {
      lines.forEach(function (l) { out.push('    • ' + l.text + srcOf(l)); });
    }
  });
  if (data.styleLines.length && opts.style) {
    out.push('  STYLE');
    data.styleLines.forEach(function (t) { out.push('    • ' + t); });
  }
  return out.join('\n');
}

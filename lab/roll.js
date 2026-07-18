#!/usr/bin/env node
/**
 * Roll-lab Node runner. Bundles the engine + lab-core into one closure and
 * prints N character sheets to stdout.
 *
 *   node lab/roll.js --n=20 --seed=1 --role=villain --detail=high --src
 *
 * --seed is the seed of the FIRST roll; roll i uses seed+i. Same seeds after
 * an engine change = a diffable before/after.
 */

"use strict";

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Same load order as index.html.
const FILES = [
  'js/tag-details.js',
  'js/plot-details.js',
  'js/want-details.js',
  'js/appearance-details.js',
  'js/clothing-details.js',
  'js/concept-details.js',
  'js/palette-details.js',
  'assets/names.js',
  'js/generator7.js',
  'lab/lab-core.js'
];

// Browser shims: $(document).ready(init) must be inert, and the engine's two
// Ramda touch-points (pluck, curry) get local stand-ins.
const PRELUDE = `
const document = {};
const $ = function () { return { ready: function () {} }; };
const R = {
  pluck: function (k) { return function (arr) { return arr.map(function (x) { return x[k]; }); }; },
  curry: function (f) { return function (a) { return function (b) { return f(a, b); }; }; }
};
`;

function loadApi() {
  const src = FILES.map(function (f) {
    return fs.readFileSync(path.join(ROOT, f), 'utf8');
  }).join('\n;\n');
  const factory = new Function(
    PRELUDE + src +
    '\n;return { buildCharacter: buildCharacter, renderCharacterText: renderCharacterText, initAll: function () { initAspects(); initTeams(); initPlots(); initWants(); } };'
  );
  const api = factory();
  api.initAll();
  return api;
}

function arg(name, fallback) {
  const hit = process.argv.find(function (a) { return a.startsWith('--' + name + '='); });
  if (hit) return hit.split('=')[1];
  if (process.argv.includes('--' + name)) return true;
  return fallback;
}

const api = loadApi();
const n = parseInt(arg('n', '10'), 10);
const seed0 = parseInt(arg('seed', '1'), 10);
const opts = {
  role: arg('role', 'any'),
  gender: arg('gender', 'any'),
  detail: arg('detail', 'high'),
  noStereotypes: !!arg('nostereo', false)
};
const render = { src: !!arg('src', false), style: !!arg('style', false) };

for (let i = 0; i < n; i++) {
  const data = api.buildCharacter(Object.assign({ seed: seed0 + i }, opts));
  console.log(api.renderCharacterText(data, render));
  console.log('');
}

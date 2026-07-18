#!/usr/bin/env node
/**
 * Builds the self-contained roll-lab page: engine + lab-core + UI in one HTML
 * file with zero external requests (Artifact CSP). Output goes to the path
 * given as argv[2], or lab/dist/rcg-roll-lab.html.
 *
 *   node lab/build.js /path/to/out.html
 */

"use strict";

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const ENGINE_FILES = [
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

// $(document).ready(init) in generator7 must be inert; R gets local stand-ins.
const SHIMS = `
const $ = function () { return { ready: function () {} }; };
const R = {
  pluck: function (k) { return function (arr) { return arr.map(function (x) { return x[k]; }); }; },
  curry: function (f) { return function (a) { return function (b) { return f(a, b); }; }; }
};
`;

const engine = ENGINE_FILES.map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n;\n');
const ui = fs.readFileSync(path.join(__dirname, 'lab-ui.html'), 'utf8');

const page = ui.replace('/*__ENGINE__*/', SHIMS + engine);

const out = process.argv[2] || path.join(__dirname, 'dist', 'rcg-roll-lab.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, page);
console.log('wrote ' + out + ' (' + (page.length / 1024).toFixed(0) + ' KB)');

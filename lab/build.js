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
const { engineSource, engineStamp } = require('./engine-files');

// $(document).ready(init) in generator7 must be inert; R gets local stand-ins.
const SHIMS = `
const $ = function () { return { ready: function () {} }; };
const R = {
  pluck: function (k) { return function (arr) { return arr.map(function (x) { return x[k]; }); }; },
  curry: function (f) { return function (a) { return function (b) { return f(a, b); }; }; }
};
`;

// The engine banks carry em-dashes and curly apostrophes inside their string
// literals. The published page has no <head> of its own to declare a charset,
// so escape every non-ASCII char to \uXXXX — correct under any encoding, and
// safe here because all non-ASCII in the engine sits inside strings/comments.
const escapeNonAscii = (s) => s.replace(/[\u0080-\uFFFF]/g,
  c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));

const engine = escapeNonAscii(engineSource());
const ui = fs.readFileSync(path.join(__dirname, 'lab-ui.html'), 'utf8');

// Stamp the engine's content hash into the page. A seed only replays to the
// same character on the engine it was rolled against, so exports carry this
// and lab/roll.js --replay warns when the desk has moved on.
const stamp = engineStamp();

const page = ui
  .replace('/*__ENGINE__*/', SHIMS + engine)
  .replace('__STAMP__', stamp);

const out = process.argv[2] || path.join(__dirname, 'dist', 'rcg-roll-lab.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, page);
console.log('wrote ' + out + ' (' + (page.length / 1024).toFixed(0) + ' KB, engine ' + stamp + ')');

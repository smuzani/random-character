/**
 * The engine bundle's file list and content hash — shared by lab/build.js
 * (which stamps the hash into the page) and lab/roll.js (which compares it on
 * --replay). Load order matches index.html.
 */

"use strict";

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

function engineSource() {
  return ENGINE_FILES
    .map(f => fs.readFileSync(path.join(ROOT, f), 'utf8'))
    .join('\n;\n');
}

function engineStamp() {
  return crypto.createHash('sha256').update(engineSource()).digest('hex').slice(0, 8);
}

module.exports = { ROOT, ENGINE_FILES, engineSource, engineStamp };

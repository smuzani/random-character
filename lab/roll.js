#!/usr/bin/env node
/**
 * Roll-lab Node runner. Bundles the engine + lab-core into one closure and
 * prints character sheets to stdout.
 *
 * Fresh batch:
 *   node lab/roll.js --n=20 --seed=1 --role=villain --detail=high --src
 *
 * Replay a phone session (paste the lab's "Copy for desk" payload):
 *   pbpaste | node lab/roll.js --replay --src
 *   node lab/roll.js --replay=flags.json --src
 *
 * --seed is the seed of the FIRST roll; roll i uses seed+i. Same seeds after
 * an engine change = a diffable before/after.
 */

"use strict";

const fs = require('fs');
const { engineSource, engineStamp } = require('./engine-files');

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
  const factory = new Function(
    PRELUDE + engineSource() +
    '\n;return { buildCharacter: buildCharacter, renderCharacterText: renderCharacterText, initAll: function () { initAspects(); initTeams(); initPlots(); initWants(); } };'
  );
  const api = factory();
  api.initAll();
  return api;
}

function arg(name, fallback) {
  const hit = process.argv.find(a => a.startsWith('--' + name + '='));
  if (hit) return hit.slice(name.length + 3);
  if (process.argv.includes('--' + name)) return true;
  return fallback;
}

const api = loadApi();
const render = { src: !!arg('src', false), style: !!arg('style', false) };
const replay = arg('replay', false);

if (replay) {
  const raw = replay === true
    ? fs.readFileSync(0, 'utf8')
    : fs.readFileSync(replay, 'utf8');

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    console.error('Could not parse the replay payload as JSON: ' + e.message);
    process.exit(1);
  }

  // Accept the seeds-only export, the full export, or a bare array of flags.
  const flags = Array.isArray(payload) ? payload : (payload.flags || []);
  if (!flags.length) {
    console.error('No flags in the payload.');
    process.exit(1);
  }

  const here = engineStamp();
  if (payload.engine && payload.engine !== here) {
    console.error('! Engine has changed since these were rolled (' +
      payload.engine + ' → ' + here + ').');
    console.error('! Seeds replay against the CURRENT engine, so these may ' +
      'differ from what you saw. The "was" line shows what the phone showed.\n');
  }

  flags.forEach(function (f) {
    // Seeds-only entries carry seed/role/detail; full entries nest them in data.opts.
    const seed = f.seed !== undefined ? f.seed : f.data.seed;
    const opts = f.role !== undefined
      ? { seed: seed, role: f.role, gender: 'any', detail: f.detail }
      : Object.assign({}, f.data.opts, { seed: seed });

    if (f.note) console.log('### NOTE: ' + f.note);
    const wasLabel = f.was || (f.data && f.data.name + ' — ' + (f.data.concept || ''));
    if (wasLabel) console.log('### on the phone: ' + wasLabel);

    console.log(api.renderCharacterText(api.buildCharacter(opts), render));
    console.log('');
  });
} else {
  const n = parseInt(arg('n', '10'), 10);
  const seed0 = parseInt(arg('seed', '1'), 10);
  const opts = {
    role: arg('role', 'any'),
    gender: arg('gender', 'any'),
    detail: arg('detail', 'high'),
    noStereotypes: !!arg('nostereo', false)
  };

  for (let i = 0; i < n; i++) {
    console.log(api.renderCharacterText(api.buildCharacter(Object.assign({ seed: seed0 + i }, opts)), render));
    console.log('');
  }
}

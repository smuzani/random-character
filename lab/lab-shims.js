/**
 * Shims that let the V7 engine load outside index.html.
 *
 * generator7.js ends with `$(document).ready(init)` and touches Ramda in three
 * places. The lab needs neither jQuery nor Ramda — it never renders through the
 * DOM path — so these stand-ins keep the file loadable without pulling two
 * libraries off a CDN (which the published artifact's CSP would block anyway).
 */

"use strict";

function $() {
  return { ready: function () {} };
}

const R = {
  pluck: function (k) {
    return function (arr) { return arr.map(function (x) { return x[k]; }); };
  },
  curry: function (f) {
    return function (a) { return function (b) { return f(a, b); }; };
  }
};

import {readFileSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const {parse} = createRequire(import.meta.url)('./fountain-parser.js');

// One classic script works over HTTP and file://, without fetching local files.
export function sampleBundle() {
  const files = JSON.parse(readFileSync(new URL('samples/index.json', import.meta.url), 'utf8'));
  if (!Array.isArray(files) || !files.length) throw new Error('At least one sample is required.');
  const seen = new Set();
  const samples = files.map(file => {
    if (!/^[a-z0-9-]+\.fountain$/i.test(file)) throw new Error('Invalid sample filename: ' + file);
    if (seen.has(file)) throw new Error('Duplicate sample: ' + file);
    seen.add(file);
    const source = readFileSync(new URL('samples/' + file, import.meta.url), 'utf8');
    try { parse(source); } catch (error) { throw new Error(file + ': ' + error.message); }
    return {file, source};
  });
  return '// Generated from samples/*.fountain by node dialogue/build-samples.mjs.\n' +
    'window.DIALOGUE_SAMPLES = ' + JSON.stringify(samples, null, 2) + ';\n';
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  writeFileSync(new URL('samples.js', import.meta.url), sampleBundle());
}

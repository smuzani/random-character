import {sampleBundle} from './build-samples.mjs';
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

const source = path => new URL('../' + path, import.meta.url);
const output = path => new URL('./dist/' + path, import.meta.url);

// Publish both generators together. Keep tests, functions and local files out of the site.
rmSync(output(''), { recursive: true, force: true });
mkdirSync(output('dialogue/'), { recursive: true });
for (const file of readdirSync(source(''), { withFileTypes: true })) {
  if (file.isFile() && /\.(html|png|ico|xml|webmanifest)$|^(manifest\.json|robots\.txt|humans\.txt)$/.test(file.name)) {
    cpSync(source(file.name), output(file.name));
  }
}
for (const directory of ['assets', 'css', 'fonts', 'img', 'js', 'lab']) {
  cpSync(source(directory), output(directory), {
    recursive: true,
    filter: path => !/(^|\/)(\.[^/]+|dist|tests)(\/|$)/.test(path.slice(source(directory).pathname.length)),
  });
}
for (const file of ['index.html', 'app.js', 'style.css', 'character-rolls.js', 'account.js', 'public-config.js']) {
  cpSync(source('dialogue/' + file), output('dialogue/' + file));
}
const parser = 'supabase/functions/_shared/fountain-parser.js';
mkdirSync(output('supabase/functions/_shared/'), {recursive: true});
cpSync(source(parser), output(parser));

cpSync(source('dialogue/vendor'), output('dialogue/vendor'), {recursive:true});

// Keep direct sample downloads, and preload all sources with one classic script.
cpSync(source('dialogue/samples'), output('dialogue/samples'), {recursive: true});
writeFileSync(output('dialogue/samples.js'), sampleBundle());

const url = process.env.DIALOGUE_SUPABASE_URL;
const key = process.env.DIALOGUE_SUPABASE_PUBLIC_KEY;
if (process.env.DIALOGUE_BACKEND === 'supabase') {
  if (!url || !key || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) throw new Error('Set the public Supabase URL and key before building.');
  if (!key.startsWith('sb_publishable_')) throw new Error('Use a Supabase publishable key, never a secret or service key.');
  writeFileSync(output('dialogue/public-config.js'), 'window.DIALOGUE_CONFIG = ' + JSON.stringify({url, key}) + ';\n');
}

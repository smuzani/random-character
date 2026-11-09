import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';

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
for (const file of ['index.html', 'app.js', 'style.css', 'character-rolls.js']) {
  cpSync(source('dialogue/' + file), output('dialogue/' + file));
}

/* RDG's single-scene Fountain reader. Metadata lives in standard Fountain notes.
   Supports headings, action, dialogue, parentheticals, notes and emphasis.
   Rejects multiple scenes and advanced layout instead of silently losing them. */
(function (root) {
  const undecorate = text => text.replace(/[*_`]/g, '').trim();
  function fields(text, allowed) {
    const result = {};
    let key;
    for (const line of text.split('\n')) {
      const match = line.match(/^\s*([*_`]*[a-z]+[*_`]*\s*):[*_`]*\s*(.*)$/i);
      const label = match && undecorate(match[1]).toLowerCase();
      if (allowed.includes(label)) {
        if (Object.hasOwn(result, label)) throw new Error('Duplicate field: ' + label);
        key = label;
        result[key] = match[2].trim();
      } else if (line.trim() && key) result[key] += '\n' + line.trim();
      else if (line.trim()) throw new Error('Unknown metadata: ' + line);
    }
    return result;
  }
  function parse(source) {
    let text = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
    text = text.replace(/^```[^\n]*\n([\s\S]*?)\n```$/, '$1');
    const scene = {title: '', characters: [], blocks: []};
    let hasSetup = false;
    text = text.replace(/\[\[([\s\S]*?)\]\]/g, (_, note) => {
      const lines = note.trim().split('\n');
      const header = undecorate(lines.shift());
      if (/^rdg$/i.test(header)) {
        if (hasSetup) throw new Error('Duplicate rdg note');
        hasSetup = true;
        Object.assign(scene, fields(lines.join('\n'), ['tone', 'start', 'end', 'length']));
      } else if (/^character\s*:/i.test(header)) {
        scene.characters.push({name: header.replace(/^character\s*:\s*/i, ''),
          ...fields(lines.join('\n'), ['voice', 'want', 'obstacle']), active: true});
      }
      return '';
    });
    if (/\[\[|\]\]/.test(text)) throw new Error('Unclosed Fountain note');
    const names = new Map();
    for (const c of scene.characters) {
      for (const key of ['name', 'voice', 'want', 'obstacle']) {
        if (!c[key]) throw new Error('Missing character ' + key);
      }
      const name = c.name.toUpperCase();
      if (names.has(name)) throw new Error('Duplicate character: ' + c.name);
      names.set(name, c.name);
    }
    for (const paragraph of text.trim().split(/\n\s*\n/).filter(p => p.trim())) {
      const lines = paragraph.trim().split('\n');
      const first = undecorate(lines[0]);
      if (/^Title\s*:/i.test(first) && !scene.location) {
        scene.title = first.replace(/^Title\s*:\s*/i, '');
        continue;
      }
      if (/^(?:INT\.?|EXT\.?|INT\.?\/EXT\.?|I\/E\.)(?:\s|\.)/i.test(first) || /^\.[a-z0-9]/i.test(first)) {
        if (scene.location) throw new Error('RDG samples must contain exactly one scene');
        scene.location = first.replace(/^\./, '');
        if (lines.length > 1) throw new Error('Add a blank line after the scene heading');
        continue;
      }
      if (!scene.location) throw new Error('Expected a Fountain scene heading');
      const cue = first.replace(/^@/, '').replace(/\s*\((?:V\.O\.|O\.S\.|CONT'D)\)$/i, '');
      const speaker = names.get(cue.toUpperCase());
      if (speaker && (first.startsWith('@') || cue === cue.toUpperCase())) {
        if (lines.length < 2) throw new Error('Missing dialogue for ' + speaker);
        scene.blocks.push({type: 'dialogue', speaker, text: lines.slice(1).join('\n')});
      } else {
        if (first.startsWith('@') || (lines.length > 1 && /^[A-Z][A-Z .’'-]*$/.test(first))) {
          throw new Error('Unknown speaker: ' + first);
        }
        if (/^(?:>|===|#|=)|\^$/.test(first)) throw new Error('Unsupported Fountain layout: ' + first);
        scene.blocks.push({type: 'action', text: paragraph.trim().replace(/^!/, '')});
      }
    }
    for (const key of ['location', 'tone', 'start', 'end']) {
      if (!scene[key]) throw new Error('Missing scene ' + key);
    }
    if (!scene.characters.length || scene.characters.length > 6) throw new Error('Samples need one to six characters');
    return scene;
  }
  root.FountainParser = {parse};
  if (typeof module !== 'undefined') module.exports = {parse};
})(globalThis);

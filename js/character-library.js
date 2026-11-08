const CharacterLibrary = (() => {
  const key = 'rcg.character-library.v1';
  const limits = { name: 60, voice: 200, want: 400, obstacle: 400 };
  const ids = /^[a-zA-Z0-9-]{1,64}$/;

  function normalize(record) {
    if (!record || typeof record !== 'object' || typeof record.id !== 'string' || !ids.test(record.id)) {
      throw new Error('Invalid character.');
    }
    const clean = { id: record.id };
    for (const [field, limit] of Object.entries(limits)) {
      const value = record[field];
      if (typeof value !== 'string' || value.length > limit || !value.trim()) {
        throw new Error('Check the character’s ' + field + '.');
      }
      clean[field] = value.trim();
    }
    for (const field of ['tags', 'excludes']) {
      const list = record[field];
      clean[field] = Array.isArray(list)
        ? list.slice(0, 100).filter(value => typeof value === 'string' && value.length <= 100)
        : [];
    }
    return clean;
  }

  function list() {
    const records = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(records)) throw new Error('Could not read saved characters.');
    return records.map(normalize);
  }

  function save(record) {
    const clean = normalize(record);
    const records = list();
    const index = records.findIndex(item => item.id === clean.id);
    if (index < 0) records.unshift(clean);
    else records[index] = clean;
    localStorage.setItem(key, JSON.stringify(records));
    return clean;
  }

  function newId() {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Prefer complete sentences from the text bank when a scene field is shorter.
  function fit(text, limit) {
    const value = text.trim();
    if (value.length <= limit) return value;
    const prefix = value.slice(0, limit);
    const sentence = prefix.match(/^.*[.!?](?=\s|$)/s);
    return (sentence ? sentence[0] : prefix.slice(0, prefix.lastIndexOf(' ') > 0 ? prefix.lastIndexOf(' ') : limit)).trim();
  }

  return { list, save, newId, fit };
})();

const $ = id => document.getElementById(id);
const scenes = [];
let script = [];
let scriptScene;

const sceneFields = ['location', 'start', 'end', 'tone', 'length'];
const characterFields = ['name', 'voice', 'want', 'obstacle'];
const maxCastSize = 6;
const selected = new Set();
let sceneIndex = 0;
let scriptLocation = '';
let editing;
const rolledDescriptions = new Map();
const genderOptions = document.querySelectorAll('[name="character-gender"]');
const selectedGender = () => $('character-form').elements['character-gender'].value;
const characterGender = character => character?.tags?.find(tag => tag === TMALE || tag === TFEMALE);

function characterTags(gender) {
  const tags = (editing?.tags ?? []).filter(tag => tag !== TMALE && tag !== TFEMALE);
  if (gender) tags.push(gender);
  return tags;
}
let busy = false;

function sceneCharacters() {
  const library = CharacterLibrary.list();
  const examples = scenes.flatMap((scene, sceneNumber) => scene.characters.map((character, index) => ({
    name: character.name,
    voice: character.voice,
    want: character.want,
    obstacle: character.obstacle,
    tags: character.gender ? [character.gender] : [],
    id: 'sample-' + sceneNumber + '-' + index
  })).filter(character => sceneNumber === sceneIndex || selected.has(character.id)));
  const savedIds = new Set(library.map(character => character.id));
  return [...library, ...examples.filter(character => !savedIds.has(character.id))];
}

function fillSetup() {
  for (const key of sceneFields) {
    if (key !== 'length') $(key).value = scenes[sceneIndex][key];
  }
  if (!$('tone').value) $('tone').selectedIndex = 0;
}

function updateCastLimit() {
  for (const checkbox of $('characters').querySelectorAll('input[type="checkbox"]')) {
    checkbox.disabled = selected.size >= maxCastSize && !checkbox.checked;
  }
  $('cast-status').textContent = selected.size >= maxCastSize ? 'The scene has reached its limit of six characters.' : '';
}

function renderCast() {
  const root = $('characters');
  root.replaceChildren();
  $('scene-characters').replaceChildren();
  let characters;
  try {
    characters = sceneCharacters();
    $('cast-status').textContent = '';
  } catch (_) {
    $('cast-status').textContent = 'Could not read the character library. Check whether browser storage is available.';
    return;
  }

  const available = new Set(characters.map(character => character.id));
  for (const id of selected) {
    if (!available.has(id)) selected.delete(id);
  }

  for (const character of characters) {
    const row = document.createElement('div');
    row.className = 'character';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selected.has(character.id);
    checkbox.setAttribute('aria-label', 'Include ' + character.name);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selected.add(character.id);
      else selected.delete(character.id);
      updateCastLimit();
      renderSceneCast(characters);
    });

    row.append(characterButton(character), checkbox);
    root.append(row);
  }
  updateCastLimit();
  renderSceneCast(characters);
}

function characterButton(character) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'character-edit';
  button.dataset.id = character.id;
  button.setAttribute('aria-haspopup', 'dialog');

  const summary = document.createElement('span');
  const name = document.createElement('strong');
  name.textContent = character.name;
  const want = document.createElement('small');
  want.textContent = 'Wants: ' + character.want;
  summary.append(name, want);
  button.append(summary);
  button.addEventListener('click', () => openCharacter(character));
  return button;
}

function renderSceneCast(characters) {
  $('scene-characters').replaceChildren(
    ...characters.filter(character => selected.has(character.id)).map(characterButton)
  );
}

// Build emphasis with DOM nodes so screenplay text never becomes HTML.
function appendFountainText(element, text) {
  const emphasis = /\\([*_\\])|\*\*\*([^*\n]+)\*\*\*|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|_([^_\n]+)_/g;
  let offset = 0;
  for (const match of text.matchAll(emphasis)) {
    element.append(text.slice(offset, match.index));
    if (match[1]) element.append(match[1]);
    else {
      const node = document.createElement(match[2] || match[3] ? 'strong' : match[4] ? 'em' : 'u');
      if (match[2]) {
        const italic = document.createElement('em');
        italic.textContent = match[2];
        node.append(italic);
      } else node.textContent = match[3] || match[4] || match[5];
      element.append(node);
    }
    offset = match.index + match[0].length;
  }
  element.append(text.slice(offset));
}

function renderScript() {
  const root = $('screenplay');
  const heading = document.createElement('h2');
  heading.className = 'scene-heading';
  heading.textContent = scriptLocation;
  root.replaceChildren(heading);
  for (const block of script) {
    const element = document.createElement('div');
    if (block.type === 'dialogue') {
      element.className = 'speech';
      const speaker = document.createElement('div');
      speaker.className = 'speaker';
      speaker.textContent = block.speaker;
      const line = document.createElement('p');
      appendFountainText(line, block.text);
      element.append(speaker, line);
    } else {
      element.className = 'action';
      appendFountainText(element, block.text);
    }
    root.append(element);
  }
}

function openCharacter(character) {
  editing = character;
  rolledDescriptions.clear();
  const gender = characterGender(character) ?? '';
  for (const option of genderOptions) option.checked = option.value === gender;
  $('character-title').textContent = character ? 'Edit character' : 'New Character';
  for (const key of characterFields) $('character-' + key).value = character?.[key] ?? '';
  $('character-status').textContent = '';
  $('character-dialog').showModal();
}

$('open-setup').onclick = () => $('setup-dialog').showModal();
$('add-scene-character').onclick = () => {
  renderCast();
  $('cast-dialog').showModal();
};
$('add-character').onclick = () => openCharacter(null);
for (const button of document.querySelectorAll('[data-close]')) {
  button.onclick = () => button.closest('dialog').close();
}

$('scene-form').onsubmit = event => {
  event.preventDefault();
  $('setup-dialog').close();
};

$('randomize').onclick = () => {
  sceneIndex = (sceneIndex + 1 + Math.floor(Math.random() * (scenes.length - 1))) % scenes.length;
  applySample();
};

function rollEditorField(field) {
  const gender = selectedGender();
  if (field === 'name') return randomName(gender || randomArray([TMALE, TFEMALE]));
  return rollDialogueField(field, {
    ...editing,
    tags: characterTags(gender),
    name: $('character-name').value
  });
}

for (const button of document.querySelectorAll('[data-roll]')) {
  button.onclick = () => {
    const field = button.dataset.roll;
    const value = rollEditorField(field);
    if (value) {
      const input = $('character-' + field);
      input.value = value;
      if (field !== 'name') rolledDescriptions.set(field, value);
      input.focus();
    }
    $('character-status').textContent = value ? '' : 'No compatible roll. You can enter your own.';
  };
}

for (const option of genderOptions) {
  option.addEventListener('change', () => {
    $('character-status').textContent = '';
    for (const [field, previous] of rolledDescriptions) {
      const input = $('character-' + field);
      if (input.value !== previous) {
        rolledDescriptions.delete(field);
        continue;
      }
      const value = rollEditorField(field);
      input.value = value;
      rolledDescriptions.set(field, value);
      if (!value) $('character-status').textContent = 'No compatible roll. You can enter your own.';
    }
  });
}

$('character-form').onsubmit = event => {
  event.preventDefault();
  const character = {
    ...editing,
    id: editing?.id ?? CharacterLibrary.newId(),
    tags: characterTags(selectedGender())
  };
  for (const key of characterFields) {
    const input = $('character-' + key);
    character[key] = input.value.trim();
    if (!character[key]) {
      input.value = '';
      input.reportValidity();
      return;
    }
  }
  try {
    CharacterLibrary.save(character);
  } catch (_) {
    $('character-status').textContent = 'Could not save the character. Check whether browser storage is available.';
    return;
  }

  if (!editing && selected.size < maxCastSize) selected.add(character.id);
  $('character-dialog').close();
  renderCast();
  const fromSetup = !$('cast-dialog').open;
  const list = $(fromSetup ? 'scene-characters' : 'characters');
  const editButton = [...list.querySelectorAll('.character-edit')]
    .find(button => button.dataset.id === character.id);
  (editButton || $(fromSetup ? 'add-scene-character' : 'add-character')).focus();
};

$('generate').onclick = async () => {
  if (busy) return;
  const status = $('status');
  const payload = {};
  for (const key of sceneFields) {
    const input = $(key);
    payload[key] = input.value.trim();
    if (key !== 'end' && !payload[key]) {
      $('setup-dialog').showModal();
      input.value = '';
      input.reportValidity();
      return;
    }
  }
  try {
    payload.characters = sceneCharacters().filter(character => selected.has(character.id))
      .map(character => {
        const {name, voice, want, obstacle} = character;
        return {name, voice, want, obstacle, gender: characterGender(character)};
      });
  } catch (_) {
    status.textContent = 'Could not read the character library. Check whether browser storage is available.';
    return;
  }

  if (payload.characters.length < 2) {
    status.textContent = 'Check at least two characters.';
    $('setup-dialog').showModal();
    $('add-scene-character').click();
    $('cast-status').textContent = status.textContent;
    return;
  }
  if (new Set(payload.characters.map(character => character.name.toLowerCase())).size !== payload.characters.length) {
    status.textContent = 'Give each checked character a different name.';
    $('setup-dialog').showModal();
    $('add-scene-character').click();
    $('cast-status').textContent = status.textContent;
    return;
  }

  busy = true;
  $('generate').disabled = true;
  status.textContent = 'Writing your scene…';
  try {
    let data;
    if (window.DialogueAccount) data = await window.DialogueAccount.generate(payload);
    else {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(55000)
    });
    data = await response.json().catch(() => ({
      error: response.status === 429 ? 'Too many requests. Try again in a minute.' : 'Generation failed. Please try again.'
    }));
    if (!response.ok || !Array.isArray(data.blocks)) throw new Error(data.error || 'Generation failed. Please try again.');
    }
    scriptScene = payload;
    script = data.blocks;
    scriptLocation = payload.location;
    renderScript();
    status.textContent = 'Scene generated.';
  } catch (error) {
    status.textContent = error.name === 'TimeoutError' ? 'Generation timed out. Please try again.' : error.message;
  } finally {
    busy = false;
    $('generate').disabled = false;
  }
};

function plainText() {
  const lines = script.map(block => block.type === 'dialogue'
    ? block.speaker.toUpperCase() + '\n' + block.text
    : block.text);
  return scriptLocation.toUpperCase() + '\n\n' + lines.join('\n\n');
}

$('copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText(plainText());
    $('status').textContent = 'Screenplay copied.';
  } catch (_) {
    $('status').textContent = 'Clipboard unavailable. Use Download as… instead.';
  }
};

function fountainText() {
  const noteText = value => String(value ?? '').replace(/\]\]/g, '] ]');
  const setup = ['[[rdg', ...['tone', 'start', 'end'].map(key =>
    key[0].toUpperCase() + key.slice(1) + ': ' + noteText(scriptScene[key])), ']]'].join('\n');
  const cast = scriptScene.characters.map(character => [
    '[[character: ' + noteText(character.name),
    ...['gender', 'voice', 'want', 'obstacle'].filter(key => character[key])
      .map(key => key[0].toUpperCase() + key.slice(1) + ': ' + noteText(character[key])),
    ']]'
  ].join('\n'));
  const blocks = script.map(block => block.type === 'dialogue'
    ? '@' + block.speaker + '\n' + block.text : block.text);
  return [setup, ...cast, '.' + scriptLocation, ...blocks].join('\n\n') + '\n';
}

$('download').onchange = () => {
  const format = $('download').value;
  if (format !== 'txt' && format !== 'fountain') return;
  const content = format === 'fountain' ? fountainText() : plainText();
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dialogue-scene.' + format;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('download').value = '';
};

function applySample() {
  const scene = scenes[sceneIndex];
  fillSetup();
  selected.clear();
  scene.characters.forEach((_, index) => selected.add('sample-' + sceneIndex + '-' + index));
  scriptScene = scene;
  script = scene.blocks;
  scriptLocation = scene.location;
  renderCast();
  renderScript();
  $('randomize').disabled = scenes.length < 2;
}

function loadSamples() {
  const controls = ['open-setup', 'generate', 'randomize', 'copy', 'download'];
  controls.forEach(id => $(id).disabled = true);
  $('status').textContent = 'Loading sample scenes…';
  try {
    const entries = window.DIALOGUE_SAMPLES;
    if (!Array.isArray(entries) || !entries.length) throw new Error('The sample bundle is missing or empty.');
    const results = entries.map(entry => {
      try {
        const {file, source} = entry;
        if (!/^[a-z0-9-]+\.fountain$/i.test(file)) throw new Error('Invalid sample filename');
        return {status: 'fulfilled', value: {...FountainParser.parse(source), file}};
      } catch (error) {
        return {status: 'rejected', reason: new Error((entry?.file || 'Sample') + ': ' + error.message)};
      }
    });
    const errors = results.filter(result => result.status === 'rejected');
    scenes.push(...results.filter(result => result.status === 'fulfilled').map(result => result.value));
    if (!scenes.length) throw new Error(errors.map(result => result.reason.message).join(' '));
    controls.forEach(id => $(id).disabled = false);
    applySample();
    $('status').textContent = errors.length ? errors.map(result => result.reason.message).join(' ') : '';
  } catch (error) {
    $('status').textContent = 'Samples could not be loaded. ' + error.message + ' Reload to try again.';
  }
}

loadSamples();

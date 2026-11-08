const $ = id => document.getElementById(id);
const scenes = [
 {location:'EXT. HIGH-RISE ROOFTOP — RAINY NIGHT',start:'Vance corners Marcus on the roof, convinced he leaked confidential files.',end:'Marcus hands over his passkey and reveals that he was protecting his sister.',tone:'Standoff',characters:[{name:'Agent Vance',voice:'Controlled, precise. Asks questions already knowing the answer.',want:'Recover the files before anyone else sees them.',obstacle:'Marcus is the only person who knows where the backup is.',active:true},{name:'Marcus',voice:'Defensive humor that cracks under pressure.',want:'Get his sister safely out of the city.',obstacle:'Vance is blocking the only exit.',active:true}]},
 {location:'INT. ALL-NIGHT LAUNDROMAT — 3 A.M.',start:'Two strangers discover that each has one half of a torn winning lottery ticket.',end:'They agree to split the prize, then notice the draw date is tomorrow.',tone:'Sitcom',characters:[{name:'Nora',voice:'Dry, practical, suspicious of good luck.',want:'Finish the laundry and avoid getting involved.',obstacle:'The stranger will not give back her half of the ticket.',active:true},{name:'Eli',voice:'Overconfident, chatty; bargains when nervous.',want:'Convince Nora they are destined to win.',obstacle:'He has been wrong about every prediction tonight.',active:true}]},
 {location:'INT. STATION CAFÉ — LAST TRAIN',start:'An estranged father arrives to return a borrowed book before his daughter leaves the country.',end:'She misses her train deliberately, but makes him ask her to stay.',tone:'Drama',characters:[{name:'June',voice:'Quick, guarded; uses logistics to avoid emotion.',want:'Leave without another argument.',obstacle:'Her father has brought the book her mother annotated.',active:true},{name:'Arthur',voice:'Careful, indirect; repairs things instead of apologizing.',want:'Find a reason for June to stay another hour.',obstacle:'He cannot admit that he is lonely.',active:true}]},
 {location:'EXT. ROYAL GARDEN — BEFORE DAWN',start:'A palace gardener catches a disgraced knight burying a crown in the flowerbed.',end:'They decide to give the crown to the person least interested in wearing it.',tone:'Drama',characters:[{name:'Fen',voice:'Blunt, unhurried, unimpressed by rank.',want:'Keep the palace soldiers away from the garden.',obstacle:'The knight has left a trail of blood through the roses.',active:true},{name:'Sera',voice:'Formal until frightened; painfully literal.',want:'Make sure the prince never finds the crown.',obstacle:'She swore an oath to return it before sunrise.',active:true}]}
];
let script=[{type:'action',text:'Rain ticks against a ventilation duct. MARCUS keeps one hand in his coat. VANCE watches that hand.'},{type:'dialogue',speaker:'Agent Vance',text:'The lift is locked.'},{type:'dialogue',speaker:'Marcus',text:'I noticed. Very welcoming building.'},{type:'dialogue',speaker:'Agent Vance',text:'Take your hand out. Slowly.'},{type:'action',text:'Marcus produces a small plastic passkey. He holds it over the edge.'},{type:'dialogue',speaker:'Marcus',text:'There’s a car downstairs. Blue. Engine running.'},{type:'dialogue',speaker:'Agent Vance',text:'Your driver can wait.'},{type:'dialogue',speaker:'Marcus',text:'She’s fourteen. She can’t drive.'},{type:'action',text:'Vance lowers the radio without switching it on.'},{type:'dialogue',speaker:'Agent Vance',text:'Who else knows she’s there?'},{type:'dialogue',speaker:'Marcus',text:'Everyone I stole those files from.'},{type:'action',text:'He sets the passkey on the duct between them. Neither reaches for it.'}];

const sceneFields = ['location', 'start', 'end', 'tone', 'length'];
const characterFields = ['name', 'voice', 'want', 'obstacle'];
const maxCastSize = 6;
const selected = new Set();
let sceneIndex = 0;
let scriptLocation = scenes[0].location;
let draft = 0;
let editing;
let busy = false;

function sceneCharacters() {
  const library = CharacterLibrary.list();
  const examples = scenes.flatMap((scene, sceneNumber) => scene.characters.map((character, index) => ({
    name: character.name,
    voice: character.voice,
    want: character.want,
    obstacle: character.obstacle,
    id: 'sample-' + sceneNumber + '-' + index
  })).filter(character => sceneNumber === sceneIndex || selected.has(character.id)));
  const savedIds = new Set(library.map(character => character.id));
  return [...library, ...examples.filter(character => !savedIds.has(character.id))];
}

function fillSetup() {
  for (const key of sceneFields) {
    if (key !== 'length') $(key).value = scenes[sceneIndex][key];
  }
}

function updateCastCount() {
  $('cast-count').textContent = '(' + selected.size + ')';
  for (const checkbox of $('characters').querySelectorAll('input[type="checkbox"]')) {
    checkbox.disabled = selected.size >= maxCastSize && !checkbox.checked;
  }
  $('cast-status').textContent = selected.size >= maxCastSize ? 'The scene has reached its limit of six characters.' : '';
}

function renderCast() {
  const root = $('characters');
  root.replaceChildren();
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

    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.textContent = Array.from(character.name)[0];
    avatar.setAttribute('aria-hidden', 'true');

    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'character-edit';
    edit.dataset.id = character.id;
    edit.setAttribute('aria-label', 'Edit ' + character.name);
    const name = document.createElement('strong');
    name.textContent = character.name;
    const want = document.createElement('small');
    want.textContent = 'Wants: ' + character.want;
    edit.append(name, want);
    edit.addEventListener('click', () => openCharacter(character));

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selected.has(character.id);
    checkbox.setAttribute('aria-label', 'Include ' + character.name);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selected.add(character.id);
      else selected.delete(character.id);
      updateCastCount();
    });

    row.append(avatar, edit, checkbox);
    root.append(row);
  }
  updateCastCount();
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
      line.textContent = block.text;
      element.append(speaker, line);
    } else {
      element.className = 'action';
      element.textContent = block.text;
    }
    root.append(element);
  }
}

function openCharacter(character) {
  editing = character;
  $('character-title').textContent = character ? 'Edit character' : 'Add character';
  for (const key of characterFields) $('character-' + key).value = character?.[key] ?? '';
  $('character-status').textContent = '';
  $('character-dialog').showModal();
}

$('open-setup').onclick = () => $('setup-dialog').showModal();
$('open-cast').onclick = () => {
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
  fillSetup();
  renderCast();
};

for (const button of document.querySelectorAll('[data-roll]')) {
  button.onclick = () => {
    const field = button.dataset.roll;
    const value = rollDialogueField(field, { ...editing, name: $('character-name').value });
    if (value) {
      const input = $('character-' + field);
      input.value = value;
      input.focus();
    }
    $('character-status').textContent = value ? '' : 'No compatible roll. You can enter your own.';
  };
}

$('character-form').onsubmit = event => {
  event.preventDefault();
  const character = { ...editing, id: editing?.id ?? CharacterLibrary.newId() };
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
  const editButton = [...$('characters').querySelectorAll('.character-edit')]
    .find(button => button.dataset.id === character.id);
  (editButton || $('add-character')).focus();
};

$('generate').onclick = async () => {
  if (busy) return;
  const status = $('status');
  const payload = {};
  for (const key of sceneFields) {
    const input = $(key);
    payload[key] = input.value.trim();
    if (!payload[key]) {
      $('setup-dialog').showModal();
      input.value = '';
      input.reportValidity();
      return;
    }
  }
  try {
    payload.characters = sceneCharacters().filter(character => selected.has(character.id))
      .map(({ name, voice, want, obstacle }) => ({ name, voice, want, obstacle }));
  } catch (_) {
    status.textContent = 'Could not read the character library. Check whether browser storage is available.';
    return;
  }

  if (payload.characters.length < 2) {
    status.textContent = 'Check at least two characters.';
    $('open-cast').click();
    $('cast-status').textContent = status.textContent;
    return;
  }
  if (new Set(payload.characters.map(character => character.name.toLowerCase())).size !== payload.characters.length) {
    status.textContent = 'Give each checked character a different name.';
    $('open-cast').click();
    $('cast-status').textContent = status.textContent;
    return;
  }

  busy = true;
  $('generate').disabled = true;
  status.textContent = 'Writing your scene…';
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(55000)
    });
    const data = await response.json().catch(() => ({
      error: response.status === 429 ? 'Too many requests. Try again in a minute.' : 'Generation failed. Please try again.'
    }));
    if (!response.ok || !Array.isArray(data.blocks)) throw new Error(data.error || 'Generation failed. Please try again.');
    script = data.blocks;
    scriptLocation = payload.location;
    renderScript();
    $('draft-label').textContent = 'Draft ' + (++draft);
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
    $('status').textContent = 'Clipboard unavailable. Use Download .txt instead.';
  }
};

$('download').onclick = () => {
  const url = URL.createObjectURL(new Blob([plainText()], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dialogue-scene.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

fillSetup();
renderCast();
renderScript();

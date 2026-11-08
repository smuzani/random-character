let dialogueCharacter;
const saveToLibrary = document.getElementById('save-to-library');

function setDialogueCharacter(character) {
  const text = id => document.getElementById(id).textContent.trim();
  const voice = [...document.querySelectorAll('#results-portrayal li')]
    .map(line => line.textContent.trim()).filter(Boolean).join(' ');
  const profile = character.dialogueProfile || {};
  dialogueCharacter = {
    id: CharacterLibrary.newId(),
    name: CharacterLibrary.fit(text('display-name'), 60),
    voice: CharacterLibrary.fit(voice || character.aspects.find(aspect => aspect.type === BPERSONALITY)?.text || text('display-concept') || 'Unspecified', 200),
    want: CharacterLibrary.fit(text('results-want') || 'Unspecified', 400),
    obstacle: CharacterLibrary.fit(text('results-plot') || 'Unspecified', 400),
    ...profile
  };
  saveToLibrary.disabled = false;
}

saveToLibrary.addEventListener('click', () => {
  const status = document.getElementById('export-status');
  if (!dialogueCharacter) return;
  try {
    CharacterLibrary.save(dialogueCharacter);
    saveToLibrary.disabled = true;
    status.textContent = 'Saved to library.';
  } catch (_) {
    status.textContent = 'Could not save the character. Check whether browser storage is available.';
  }
});

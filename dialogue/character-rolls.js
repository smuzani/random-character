// Both generators use the V7 pools, weights and compatibility rules.
initWants();
initPlots();

function rollDialogueField(field, character) {
  const candidate = new Character(character.tags);
  candidate.excludes = new Set(character.excludes);
  const gender = candidate.tags.has(TFEMALE) ? TFEMALE : candidate.tags.has(TMALE) ? TMALE : '';
  generatePronouns(gender, character.name.trim() || 'this character');

  const isWant = field === 'want';
  const describe = isWant ? wantToDesc : plotToDesc;
  if (isWant) generateWant(candidate);
  else generateOneShot(candidate);
  const aspect = candidate.aspects[0];
  const text = aspect && [...aspect.tags].map(describe).find(Boolean);
  return text ? CharacterLibrary.fit(text, 400) : '';
}

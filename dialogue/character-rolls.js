// Dialogue rolls reuse the V7 text banks and compatibility rules.
initAspects();
initWants();
initPlots();

function rollDialogueVoice(candidate) {
  let portrayals = [...candidate.tags].map(tagToPortrayal).filter(Boolean);
  if (!portrayals.length) {
    const compatibleTags = new Set(obtainRoot(aspects, candidate).flatMap(aspect => [...aspect.tags]));
    portrayals = [...compatibleTags].map(tagToPortrayal).filter(Boolean);
  }
  return portrayals.length ? CharacterLibrary.fit(randomArray(portrayals), 200) : '';
}

function rollDialogueField(field, character) {
  const candidate = new Character(character.tags);
  candidate.excludes = new Set(character.excludes);
  const gender = candidate.tags.has(TFEMALE) ? TFEMALE : candidate.tags.has(TMALE) ? TMALE : '';
  generatePronouns(gender, character.name.trim() || 'this character');

  if (field === 'voice') return rollDialogueVoice(candidate);

  const isWant = field === 'want';
  const describe = isWant ? wantToDesc : plotToDesc;
  if (isWant) generateWant(candidate);
  else generateOneShot(candidate);
  const aspect = candidate.aspects[0];
  const text = aspect && [...aspect.tags].map(describe).find(Boolean);
  return text ? CharacterLibrary.fit(text, 400) : '';
}

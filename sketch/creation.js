'use strict';

// A deliberately small authored deck. Independent of the V7 generation rules:
// this experiment tests choices, not integration with the full content bank.
const intentions = [
  {
    title: 'Bring someone home', want: 'Bring a missing loved one home.',
    hint: 'They kept a place at the table. Everyone else stopped asking.',
    prop: 'A second cup, carefully wrapped and never used.',
    obstacles: [
      ['They left willingly', 'The missing person finally feels free. Being found is the last thing they want.', 'A rescuer who may be the danger', 'When does devotion become possession?'],
      ['The trail belongs to an enemy', 'Only someone they once betrayed knows where to look.', 'A supplicant with a long memory', 'Can they ask for mercy without pretending they deserve it?'],
      ['Someone else needs them here', 'Following the trail means leaving a dependent person behind.', 'A protector pulled in two', 'Who gets to be the person they come back for?']
    ],
    scene: 'A message arrives: “I am safe. Stop looking.” There is no proof it was written freely.',
    responses: [
      ['Keep searching', 'They can bear being hated more easily than being uncertain.', 'Ask one question too many. Call it being thorough.'],
      ['Send a way back, then wait', 'They offer help without being allowed to know whether it was needed.', 'Leave an invitation open, even when silence hurts.'],
      ['Ask someone impartial to check', 'They entrust the answer to someone who might tell them to let go.', 'Ask for a second opinion, then struggle not to argue with it.']
    ]
  },
  {
    title: 'Become someone who matters', want: 'Earn a place where their voice carries weight.',
    hint: 'They remember every room where nobody learned their name.',
    prop: 'An invitation folded so often it is splitting at the creases.',
    obstacles: [
      ['Their reputation is borrowed', 'The achievement that opened every door was somebody else’s work.', 'An impostor trying to grow into the lie', 'Will becoming worthy ever make the theft right?'],
      ['Success means leaving their people', 'The people offering a place expect them to cut ties with home.', 'An outsider at the good table', 'What use is belonging if nobody they love can follow?'],
      ['Their rival deserves it too', 'There is one place. Their closest friend has worked just as hard for it.', 'A rival who still cares', 'Can they celebrate someone whose success shuts them out?']
    ],
    scene: 'At last, someone important praises them in public—by humiliating their oldest friend.',
    responses: [
      ['Interrupt the praise', 'They risk the recognition they wanted rather than let their friend stand alone.', 'Correct a powerful person politely, with hands clenched out of sight.'],
      ['Accept it. Find the friend later.', 'They protect their opportunity and hope a private apology will be enough.', 'Keep smiling after a remark lands badly. Remember it all evening.'],
      ['Bring the friend into the spotlight', 'They share the attention, gambling that there is room for both of them.', 'Turn a compliment into a story about someone else.']
    ]
  },
  {
    title: 'Make up for what they did', want: 'Repair the harm they caused.',
    hint: 'They have rehearsed the apology. The difficult part comes after it.',
    prop: 'A broken keepsake, repaired badly but carried everywhere.',
    obstacles: [
      ['Their victim refuses their help', 'Contact would reopen a wound the other person wants left alone.', 'A penitent without an audience', 'Can they change without ever being forgiven?'],
      ['The truth would hurt someone innocent', 'An honest confession would expose a person who had no part in the harm.', 'A keeper of an ugly secret', 'Whose peace would their clean conscience cost?'],
      ['Everyone calls it a heroic deed', 'Their worst act is the reason people trust them.', 'A hero who knows better', 'Can they surrender the story everyone needs them to be?']
    ],
    scene: 'Someone offers them public forgiveness, provided they agree never to discuss what actually happened.',
    responses: [
      ['Refuse the bargain', 'They choose an unfinished reckoning over a clean public ending.', 'Become painfully precise when someone calls a matter settled.'],
      ['Accept, then repair what they can', 'They work quietly, knowing their silence also protects them.', 'Do small favors anonymously. Deflect questions about why.'],
      ['Ask the people harmed to decide', 'They give up control over how their own redemption story ends.', 'Ask what would help, and wait through an uncomfortable answer.']
    ]
  }
];

const methods = [
  { title: 'Make them like me', text: 'Read the room. Become the person it needs.', trope: 'The practiced charmer',
    habit: 'They remember small preferences and dodge questions about their own.',
    cost: 'Every successful performance makes it harder to ask for something honestly.',
    approaches: ['They make allies along the trail, never admitting how desperate they are.', 'They learn which version of themselves gets invited back.', 'They make an apology easy to accept. Perhaps too easy.'],
    look: ['An immaculate outer layer with a hastily repaired lining.', 'An open, welcoming pose; one foot already angled toward the exit.'], colors: ['#663d75', '#e3b867', '#eee4f3'] },
  { title: 'Be impossible to move', text: 'Stay. Work. Endure longer than the problem.', trope: 'The relentless caretaker',
    habit: 'They take the worst seat and insist they prefer it.',
    cost: 'They treat needing help as a personal failure.',
    approaches: ['They keep searching long after their companions have gone home.', 'They become indispensable, then wonder why nobody sees anything else in them.', 'They try to pay an emotional debt with exhausting practical work.'],
    look: ['Broad, layered clothing with visibly mended elbows.', 'A planted stance; hands occupied fixing something small.'], colors: ['#365b62', '#c9a277', '#e3e9df'] },
  { title: 'Find the hidden way through', text: 'Notice the rule nobody checks. Keep a second plan.', trope: 'The guarded schemer',
    habit: 'They answer a question with a useful fact that is not quite the answer.',
    cost: 'They withhold plans even from people whose trust they need.',
    approaches: ['They trace the missing person’s movements without asking permission.', 'They learn who actually makes decisions, away from the grand speeches.', 'They arrange repairs behind the scenes, tempted to manage other people’s reactions too.'],
    look: ['An asymmetric coat with a concealed inner pocket.', 'A half-turned pose, watching a conversation outside the frame.'], colors: ['#434963', '#a7b9af', '#d9b0ba'] }
];

const questions = ['What keeps you going?', 'What’s in the way?', 'How do you get your way?', 'What do you do when it hurts?'];
let state;
const pick = n => Math.floor(Math.random() * n);
const play = document.getElementById('play');
const sheet = document.getElementById('sheet');
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch]));

function start(mode = 'discover') {
  state = { choices: [], step: 0, mode, name: '', visual: pick(3) };
  document.getElementById('status').textContent = '';
  if (mode !== 'discover') finish(); else render();
}

function options() {
  const intention = intentions[state.choices[0]];
  if (state.step === 0) return intentions.map(x => [x.title, x.hint]);
  if (state.step === 1) return intention.obstacles;
  if (state.step === 2) return methods.map((x, i) => [x.title, x.approaches[state.choices[0]] + ' ' + x.cost]);
  return intention.responses;
}

function choose(index) {
  // Earlier choices own everything downstream. Revisit explicitly re-deals it.
  state.choices[state.step] = index;
  state.choices = state.choices.slice(0, state.step + 1);
  state.step++;
  render();
}

function finish() {
  while (state.choices.length < 4) state.choices.push(pick(3));
  state.step = 4;
  render();
}

function revisit(step) {
  state.step = step;
  state.choices = state.choices.slice(0, step);
  render();
}

function drawing(intention, method) {
  const faces = ['Close-cropped curls, a long face, and heavy brows.', 'A loose braid, a round face, and a gap between the front teeth.', 'A tangled fringe, an angular face, and a crooked nose.'];
  return `<section class="drawing"><h3>Draw this character</h3><ul><li>${faces[state.visual]}</li>${method.look.map(x => `<li>${x}</li>`).join('')}<li>${intention.prop}</li></ul><div class="swatches">${method.colors.map(c => `<div class="swatch"><i style="background:${c}"></i><small>${c}</small></div>`).join('')}</div><p class="note">Palette for clothing and props. Choose any skin tone, gender, age, or setting.</p></section>`;
}

function renderSheet() {
  const [w, o, m, r] = state.choices;
  const intention = intentions[w];
  const obstacle = intention && intention.obstacles[o];
  const method = methods[m];
  const response = intention && intention.responses[r];
  let content = '<p class="progress">Your character, taking shape</p>';
  if (!intention) {
    sheet.innerHTML = content + '<h2>Start with a want.</h2><p class="empty">The choices you keep will appear here. You can let chance finish at any point.</p>';
    return;
  }
  content += `<label for="character-name">Name (optional)</label><input id="character-name" maxlength="80" placeholder="Someone, for now" value="${escapeHtml(state.name)}">`;
  if (obstacle) content += `<h2>${obstacle[2]}</h2>`;
  if (state.mode === 'draw' && method) content += drawing(intention, method);
  const parts = [['Wants', intention.want], ['But', obstacle && obstacle[1]], ['Usually', method && method.approaches[w]], ['Under pressure', response && `${intention.scene} ${response[0]}. ${response[1]}`]];
  content += parts.filter(x => x[1]).map((x, i) => `<div class="thread"><h3>${x[0]} <button data-revisit="${i}" aria-label="Change ${x[0].toLowerCase()} and choose again from there">Change</button></h3><p>${x[1]}</p></div>`).join('');
  if (method) {
    content += `<h3>Play them through small things</h3><p>${method.habit} ${response ? response[2] : ''}</p>`;
    if (state.mode !== 'draw') content += drawing(intention, method);
  }
  if (state.step === 4) content += '<div class="actions"><button id="save">Save character</button><button id="copy">Copy text</button></div>';
  sheet.innerHTML = content;
  const nameInput = document.getElementById('character-name');
  if (nameInput) nameInput.addEventListener('input', e => { state.name = e.target.value; });
  sheet.querySelectorAll('[data-revisit]').forEach(button => button.addEventListener('click', () => revisit(Number(button.dataset.revisit))));
  if (state.step === 4) {
    document.getElementById('save').onclick = save;
    document.getElementById('copy').onclick = copy;
  }
}

function render() {
  document.querySelector('.workspace').classList.toggle('drawing-first', state.mode === 'draw' && state.step === 4);
  document.getElementById('status').textContent = '';
  renderSheet();
  const [w, o, m] = state.choices;
  if (state.step < 4) {
    play.innerHTML = `<p class="progress">${state.step + 1} of 4 · ${['Intention', 'Obstacle', 'Approach', 'A moment of truth'][state.step]}</p><h2 id="question" tabindex="-1">${questions[state.step]}</h2><p>${state.step === 0 ? 'Pick the thread you want to pull.' : state.step === 1 ? intentions[w].want : state.step === 2 ? intentions[w].obstacles[o][1] : intentions[w].scene}</p><div class="choices">${options().map((x, i) => `<button class="choice" data-choice="${i}"><strong>${x[0]}</strong><span>${x[1]}</span></button>`).join('')}</div><div class="actions">${state.step ? '<button id="back">Back</button>' : ''}<button id="chance">Choose for me</button><button id="finish">Let chance finish</button></div><p class="note">Changing an earlier choice starts again from that point.</p>`;
    play.querySelectorAll('[data-choice]').forEach(button => button.onclick = () => choose(Number(button.dataset.choice)));
    document.getElementById('chance').onclick = () => choose(pick(3));
    document.getElementById('finish').onclick = finish;
    if (state.step) document.getElementById('back').onclick = () => revisit(state.step - 1);
  } else {
    const obstacle = intentions[w].obstacles[o];
    play.innerHTML = `<p class="progress">A character to take somewhere</p><h2 id="question" tabindex="-1">${obstacle[2]}</h2><p>${obstacle[3]}</p><p>You have a starting point. The answer belongs to the story you play.</p><h3>Pull another thread</h3><p class="note">Open a connection. See what makes this combination interesting.</p><details><summary>${methods[m].trope}</summary><p>${methods[m].habit} ${methods[m].cost}</p><p>Alongside this want: ${methods[m].approaches[w]}</p><button id="another-method">Explore another approach</button></details><details><summary>${obstacle[0]}</summary><p>${obstacle[1]} ${obstacle[3]}</p><button id="another-obstacle">Explore another obstacle</button></details><div class="actions"><button id="again" class="primary">Discover someone else</button><button id="roll-again">Make another for me</button></div>`;
    document.getElementById('another-method').onclick = () => revisit(2);
    document.getElementById('another-obstacle').onclick = () => revisit(1);
    document.getElementById('again').onclick = () => start();
    document.getElementById('roll-again').onclick = () => start(state.mode === 'draw' ? 'draw' : 'quick');
  }
  document.getElementById('question').focus({ preventScroll: true });
}

function characterText() {
  const [w, o, m, r] = state.choices;
  const intention = intentions[w], obstacle = intention.obstacles[o], method = methods[m];
  const drawingText = sheet.querySelector('.drawing').innerText;
  return `${state.name || 'Someone, for now'}\n${obstacle[2]}\n\nWants: ${intention.want}\nBut: ${obstacle[1]}\nSo: ${method.approaches[w]}\n\nA moment of truth: ${intention.scene}\nChoice: ${intention.responses[r][0]}\n${intention.responses[r][1]}\n\nPortrayal: ${method.habit} ${intention.responses[r][2]}\nCost: ${method.cost}\n\n${obstacle[3]}\n\n${drawingText}`;
}

function save() {
  const url = URL.createObjectURL(new Blob([characterText()], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'character-sketch.txt'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.getElementById('status').textContent = 'Character file prepared.';
}

async function copy() {
  const text = characterText();
  try {
    await navigator.clipboard.writeText(text);
    document.getElementById('status').textContent = 'Character copied.';
  } catch (_) {
    const status = document.getElementById('status');
    status.innerHTML = '<label for="copy-fallback">Copy this character text:</label><textarea id="copy-fallback" readonly></textarea>';
    const field = document.getElementById('copy-fallback');
    field.value = text; field.focus(); field.select();
  }
}

document.getElementById('discover').onclick = () => start();
document.getElementById('quick').onclick = () => start('quick');
document.getElementById('draw').onclick = () => start('draw');
start();

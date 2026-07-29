const app = () => document.getElementById('app');

function parseHash() {
  const h = location.hash;
  const m = h.match(/^#\/stage\/(\d+)$/);
  if (m) return { view: 'stage', id: Number(m[1]) };
  return { view: 'welcome' };
}

function go(hash) { location.hash = hash; }

function findStage(id) {
  return window.QUEST.stages.find(s => s.id === id);
}

function renderWelcome() {
  const w = window.QUEST.welcome;
  app().innerHTML = `
    <section class="screen welcome">
      ${w.image ? `<img class="clue" src="${w.image}" alt="">` : ''}
      <h1>${w.title}</h1>
      <div class="text">${w.text}</div>
      <button id="start-btn" class="primary">${w.buttonText || 'Начать →'}</button>
    </section>`;
  document.getElementById('start-btn').addEventListener('click', () => go('#/stage/1'));
}

function normalize(s) { return String(s).trim().toLowerCase(); }

function checkAnswer(stage, input) {
  return normalize(input) === normalize(stage.answer);
}

function renderStage(stage) {
  app().innerHTML = `
    <section class="screen stage">
      ${stage.image ? `<img class="clue" src="${stage.image}" alt="">` : ''}
      <h1>${stage.title}</h1>
      <div class="text">${stage.riddle}</div>
      <div class="answer-block">
        <input id="code" class="code-input" type="text" inputmode="text"
               autocomplete="off" placeholder="Код-слово">
        <button id="check-btn" class="primary" disabled>Проверить</button>
      </div>
      <div id="feedback" class="feedback"></div>
      ${stage.hint ? `<details class="hint"><summary>Подсказка</summary>${stage.hint}</details>` : ''}
      <div id="next-block"></div>
    </section>`;

  const input = document.getElementById('code');
  const checkBtn = document.getElementById('check-btn');

  input.addEventListener('input', () => {
    checkBtn.disabled = normalize(input.value) === '';
  });
  const submit = () => {
    if (checkBtn.disabled) return;
    if (checkAnswer(stage, input.value)) onCorrect(stage);
    else onWrong(stage, input);
  };
  checkBtn.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

function onCorrect(stage) {
  // финальное поведение в Task 5; временно:
  document.getElementById('feedback').textContent = 'ВЕРНО';
}

function onWrong(stage, inputEl) {
  // финальное поведение в Task 5; временно:
  document.getElementById('feedback').textContent = 'НЕВЕРНО';
}

function render() {
  const route = parseHash();
  if (route.view === 'welcome') return renderWelcome();
  const stage = findStage(route.id);
  if (!stage) return go('#/stage/1');
  renderStage(stage);
}

window.addEventListener('load', render);
window.addEventListener('hashchange', render);

const app = () => document.getElementById('app');

function parseHash() {
  const h = location.hash;
  const m = h.match(/^#\/stage\/(\d+)$/);
  if (m) return { view: 'stage', id: Number(m[1]) };
  if (h === '#/finish') return { view: 'finish' };
  if (h === '' || h === '#' || h === '#/' || h === '#/welcome') return { view: 'welcome' };
  return { view: 'unknown' };
}

function go(hash) { location.hash = hash; }

function findStage(id) {
  return window.QUEST.stages.find(s => s.id === id);
}

// Ставит фон-паттерн для текущей страницы. page.bg — путь относительно
// index.html (напр. "img/bg-stage1.png"). Нет bg → глобальный дефолт из CSS.
function applyBackground(page) {
  const bg = page && page.bg;
  if (bg) document.body.style.setProperty('--bg-tile', `url("${bg}")`);
  else document.body.style.removeProperty('--bg-tile');
}

function renderWelcome() {
  const w = window.QUEST.welcome;
  applyBackground(w);
  app().innerHTML = `
    <section class="screen welcome">
      ${w.image ? `<img class="clue" src="${w.image}" alt="">` : ''}
      <h1>${w.title}</h1>
      <div class="text">${w.text}</div>
      <button id="start-btn" class="primary">${w.buttonText || 'Начать →'}</button>
    </section>`;
  document.getElementById('start-btn').addEventListener('click', () => go('#/stage/1'));
}

function renderFinish() {
  const f = window.QUEST.finish;
  applyBackground(f);
  app().innerHTML = `
    <section class="screen finish">
      ${f.image ? `<img class="clue" src="${f.image}" alt="">` : ''}
      <h1>${f.title}</h1>
      <div class="text">${f.text}</div>
    </section>`;
}

function normalize(s) { return String(s).trim().toLowerCase(); }

function checkAnswer(stage, input) {
  return normalize(input) === normalize(stage.answer);
}

function renderStage(stage) {
  applyBackground(stage);
  // нет ответа → этап без ввода, переход на следующий по QR-коду
  const hasAnswer = stage.answer != null && String(stage.answer).trim() !== '';
  const answerBlock = hasAnswer ? `
      <div class="answer-block">
        <input id="code" class="code-input" type="text" inputmode="text"
               autocomplete="off" autocorrect="off" autocapitalize="off"
               spellcheck="false" placeholder="Код-слово">
        <button id="check-btn" class="primary" disabled>Проверить</button>
      </div>
      <div id="feedback" class="feedback"></div>` : '';
  app().innerHTML = `
    <section class="screen stage">
      ${stage.image ? `<img class="clue" src="${stage.image}" alt="">` : ''}
      <h1>${stage.title}</h1>
      <div class="text">${stage.riddle}</div>
      ${answerBlock}
      ${stage.hint ? `<details class="hint"><summary>Подсказка</summary>${stage.hint}</details>` : ''}
      ${hasAnswer ? `<div id="next-block"></div>` : ''}
    </section>`;

  if (!hasAnswer) return;

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
  input.focus();
}

function onCorrect(stage) {
  const screen = document.querySelector('.screen.stage');
  screen.querySelector('.answer-block').classList.add('hidden');
  // после верного ответа скрываем вопрос и изначальную картинку этапа
  const riddle = screen.querySelector('.text');
  if (riddle) riddle.classList.add('hidden');
  const topImg = screen.querySelector('img.clue');  // награда ещё не добавлена
  if (topImg) topImg.classList.add('hidden');
  const fb = document.getElementById('feedback');
  fb.className = 'feedback ok';
  fb.innerHTML = stage.correctText || 'Верно!';
  const nb = document.getElementById('next-block');
  // опц. картинка-награда, показывается после верного ответа
  const reward = stage.correctImage
    ? `<img class="clue reward" src="${stage.correctImage}" alt="">` : '';
  if (stage.next != null) {
    nb.innerHTML = reward + `<button id="next-btn" class="primary">Дальше →</button>`;
    document.getElementById('next-btn')
      .addEventListener('click', () => go('#/stage/' + stage.next));
  } else {
    // последний этап → кнопка ведёт на отдельную страницу финала
    nb.innerHTML = reward + `<button id="next-btn" class="primary">Финал →</button>`;
    document.getElementById('next-btn')
      .addEventListener('click', () => go('#/finish'));
  }
}

function pickWrongText(stage) {
  const arr = stage.wrongTexts;
  if (!arr || arr.length === 0) return 'Не то, попробуй ещё';
  return arr[Math.floor(Math.random() * arr.length)];
}

function onWrong(stage, inputEl) {
  const fb = document.getElementById('feedback');
  fb.className = 'feedback bad';
  fb.textContent = pickWrongText(stage);
  inputEl.classList.remove('shake');
  void inputEl.offsetWidth; // рестарт анимации
  inputEl.classList.add('shake');
  // поле не очищаем
}

function render() {
  const route = parseHash();
  if (route.view === 'welcome') return renderWelcome();
  if (route.view === 'finish') return renderFinish();
  if (route.view === 'unknown') return go('#/stage/1');
  const stage = findStage(route.id);
  if (!stage) return go('#/stage/1');
  renderStage(stage);
}

window.addEventListener('load', render);
window.addEventListener('hashchange', render);

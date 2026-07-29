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

function render() {
  const route = parseHash();
  if (route.view === 'welcome') return renderWelcome();
  // stage-рендер добавляется в следующей задаче; пока заглушка:
  app().textContent = `Этап ${route.id} (в разработке)`;
}

window.addEventListener('load', render);
window.addEventListener('hashchange', render);

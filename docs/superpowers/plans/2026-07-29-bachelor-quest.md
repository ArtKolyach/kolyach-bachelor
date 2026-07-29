# Квест на мальчишник — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Мобильный статический веб-квест на мальчишник: стартовый экран → 5 этапов с загадками и вводом кода → финал. Хостинг GitHub Pages.

**Architecture:** Один `index.html` + hash-роутинг на vanilla JS. Контент квеста (стартовый экран + этапы) вынесен данными в `js/stages.js`; вся логика (роутинг, рендер, проверка кода) в `js/quest.js`; оформление в `css/styles.css`. Сборки нет — GitHub Pages отдаёт файлы напрямую.

**Tech Stack:** HTML, CSS (mobile-first, тёмная тема), vanilla JavaScript (ES modules или классические `<script>`). Без фреймворков, без сборки. QR-коды генерятся отдельно как PNG.

## Global Constraints

- Без сборки и без внешних JS-зависимостей в рантайме (GitHub Pages отдаёт статику как есть).
- Язык интерфейса — русский.
- Mobile-first, тёмная тема, крупные тапабельные элементы.
- Роутинг только через hash (`#/welcome`, `#/stage/<id>`) — работает на GitHub Pages без сервера.
- Сверка кода нормализованная: `trim()` + `toLowerCase()` с обеих сторон.
- Весь контент квеста живёт только в `js/stages.js`; `quest.js` контента не содержит.
- «Тест» в этом проекте = ручная проверка в браузере через локальный сервер (`npx serve .` или `python -m http.server`), затем открыть `http://localhost:PORT`.

---

## Структура файлов

- `index.html` — каркас: `<div id="app">`, подключение CSS и `js/stages.js` + `js/quest.js`.
- `css/styles.css` — стили, тёмная тема, анимации (тряска, переход).
- `js/stages.js` — данные: `const welcome = {...}`, `const stages = [...]`. Экспорт в глобал (`window.QUEST = { welcome, stages }`).
- `js/quest.js` — логика: чтение hash, рендер стартового/этапа/финала, проверка кода.
- `README.md` — инструкция по деплою на GitHub Pages и генерации QR.
- Удаляются: `src/index.ts`, `tsconfig.json`. `package.json` чистится от TS.

---

### Task 1: Очистка болванки и каркас статики

**Files:**
- Delete: `src/index.ts`, `tsconfig.json`
- Modify: `package.json`
- Create: `index.html`, `css/styles.css`, `js/stages.js`, `js/quest.js`

**Interfaces:**
- Produces: `window.QUEST = { welcome, stages }` из `stages.js`; функция `render()` в `quest.js`, вызываемая на `load` и `hashchange`.

- [ ] **Step 1: Удалить Node/TS болванку**

```bash
git rm src/index.ts tsconfig.json
```

- [ ] **Step 2: Почистить package.json**

Заменить содержимое `package.json` на:

```json
{
  "name": "kolyach-bachelor",
  "version": "1.0.0",
  "description": "Квест на мальчишник — статический сайт для GitHub Pages",
  "private": true,
  "scripts": {
    "serve": "npx --yes serve ."
  }
}
```

- [ ] **Step 3: Создать каркас index.html**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Квест</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <main id="app"></main>
  <script src="js/stages.js"></script>
  <script src="js/quest.js"></script>
</body>
</html>
```

- [ ] **Step 4: Заглушки данных и логики**

`js/stages.js`:

```js
window.QUEST = {
  welcome: { title: "Загрузка…", text: "", buttonText: "Начать →" },
  stages: []
};
```

`js/quest.js`:

```js
function render() {
  const app = document.getElementById('app');
  app.textContent = 'Каркас работает';
}
window.addEventListener('load', render);
window.addEventListener('hashchange', render);
```

`css/styles.css`:

```css
:root { color-scheme: dark; }
body { margin: 0; background: #111; color: #eee; font-family: system-ui, sans-serif; }
```

- [ ] **Step 5: Проверить в браузере**

Run: `npm run serve` затем открыть показанный `http://localhost:PORT`
Expected: тёмный фон, текст «Каркас работает».

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: убрать TS-болванку, каркас статического сайта"
```

---

### Task 2: Данные квеста (стартовый экран + 5 этапов)

**Files:**
- Modify: `js/stages.js`

**Interfaces:**
- Produces: `window.QUEST.welcome` (объект) и `window.QUEST.stages` (массив объектов-этапов). Форма этапа: `{ id:number, title:string, riddle:string, answer:string, next?:number, image?:string, hint?:string, wrongTexts?:string[], correctText?:string }`. Форма welcome: `{ title:string, text:string, image?:string, buttonText?:string }`.

- [ ] **Step 1: Заполнить stages.js данными-плейсхолдерами**

Тексты загадок — черновые, дорабатываются позже (вариант B в спеке). Коды указаны реальные для проверки прохождения.

```js
window.QUEST = {
  welcome: {
    title: "Мальчишник Коляныча",
    text: "Впереди 5 испытаний. Проходи этап — получай код — двигайся дальше. Погнали!",
    buttonText: "Начать →"
  },
  stages: [
    {
      id: 1,
      title: "Этап 1",
      riddle: "Черновая загадка 1. Введи слово-код.",
      answer: "старт",
      next: 2,
      hint: "Подсказка к этапу 1",
      wrongTexts: ["Не, брат, думай ещё 🍺", "Мимо!", "Холодно…"],
      correctText: "Верно! Держи путь к следующей точке 🎯"
    },
    {
      id: 2,
      title: "Этап 2",
      riddle: "Черновая загадка 2.",
      answer: "пиво",
      next: 3,
      wrongTexts: ["Не то", "Ещё по одной и попробуй"],
      correctText: "Красава, дальше!"
    },
    {
      id: 3,
      title: "Этап 3",
      riddle: "Черновая загадка 3.",
      answer: "коляныч",
      next: 4,
      correctText: "Верно!"
    },
    {
      id: 4,
      title: "Этап 4",
      riddle: "Черновая загадка 4.",
      answer: "финал",
      next: 5,
      wrongTexts: ["Не угадал"],
      correctText: "Последний рывок!"
    },
    {
      id: 5,
      title: "Финал",
      riddle: "Последнее задание. Введи финальный код.",
      answer: "победа",
      correctText: "Ты дошёл! Сбор тут: <b>укажи адрес</b> 🎉"
      // next отсутствует → финальный этап
    }
  ]
};
```

- [ ] **Step 2: Проверить загрузку данных**

Run: обновить вкладку, открыть DevTools Console, ввести `QUEST.stages.length`
Expected: `5`; `QUEST.welcome.title` → `"Мальчишник Коляныча"`.

- [ ] **Step 3: Commit**

```bash
git add js/stages.js
git commit -m "feat: данные квеста — стартовый экран и 5 этапов"
```

---

### Task 3: Роутинг и стартовый экран

**Files:**
- Modify: `js/quest.js`

**Interfaces:**
- Consumes: `window.QUEST.welcome`, `window.QUEST.stages`.
- Produces: `parseHash()` → `{ view:'welcome' } | { view:'stage', id:number }`; `render()` диспетчеризует по hash; `renderWelcome()`; хелпер `go(hash)` меняет `location.hash`.

- [ ] **Step 1: Реализовать роутинг + рендер welcome**

Заменить содержимое `js/quest.js`:

```js
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
```

- [ ] **Step 2: Проверить стартовый экран и переход**

Run: открыть `http://localhost:PORT` (без hash)
Expected: заголовок «Мальчишник Коляныча», текст, кнопка «Начать →». Тап по кнопке → hash `#/stage/1`, текст «Этап 1 (в разработке)».

- [ ] **Step 3: Commit**

```bash
git add js/quest.js
git commit -m "feat: hash-роутинг и стартовый экран"
```

---

### Task 4: Рендер этапа и проверка кода (верно/неверно)

**Files:**
- Modify: `js/quest.js`

**Interfaces:**
- Consumes: `findStage(id)`, `go(hash)`, форма этапа из Task 2.
- Produces: `renderStage(stage)`; `normalize(str)` → строка (`trim().toLowerCase()`); `checkAnswer(stage, input)` → boolean; `onCorrect(stage)`, `onWrong(stage, inputEl)`. Битый/несуществующий id → `go('#/stage/1')`.

- [ ] **Step 1: Реализовать рендер этапа и обработку ввода**

В `js/quest.js` добавить функции и заменить заглушку в `render()`:

```js
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
```

Заменить тело `render()`:

```js
function render() {
  const route = parseHash();
  if (route.view === 'welcome') return renderWelcome();
  const stage = findStage(route.id);
  if (!stage) return go('#/stage/1');
  renderStage(stage);
}
```

- [ ] **Step 2: Проверить рендер и валидацию**

Run: перейти на `#/stage/1`
Expected: заголовок «Этап 1», загадка, поле ввода, кнопка «Проверить» (неактивна пока поле пустое), раскрывающаяся «Подсказка». Ввод `старт` + Проверить → «ВЕРНО». Ввод `xxx` → «НЕВЕРНО».

- [ ] **Step 3: Проверить битый hash**

Run: вручную ввести в адресе `#/stage/99`
Expected: редирект на `#/stage/1`.

- [ ] **Step 4: Commit**

```bash
git add js/quest.js
git commit -m "feat: рендер этапа и проверка кода"
```

---

### Task 5: Поток верного и неверного ответа

**Files:**
- Modify: `js/quest.js`, `css/styles.css`

**Interfaces:**
- Consumes: `stage.correctText`, `stage.next`, `stage.wrongTexts`, `go(hash)`.
- Produces: финальные `onCorrect(stage)` и `onWrong(stage, inputEl)`; `pickWrongText(stage)` → строка. CSS-классы `.shake`, `.hidden`.

- [ ] **Step 1: Реализовать onCorrect (текст + кнопка «Дальше»)**

Заменить временную `onCorrect`:

```js
function onCorrect(stage) {
  document.querySelector('.answer-block').classList.add('hidden');
  const fb = document.getElementById('feedback');
  fb.className = 'feedback ok';
  fb.innerHTML = stage.correctText || 'Верно!';
  const nb = document.getElementById('next-block');
  if (stage.next != null) {
    nb.innerHTML = `<button id="next-btn" class="primary">Дальше →</button>`;
    document.getElementById('next-btn')
      .addEventListener('click', () => go('#/stage/' + stage.next));
  }
  // stage.next отсутствует → финальный этап, кнопки нет
}
```

- [ ] **Step 2: Реализовать onWrong (случайный текст + тряска)**

Заменить временную `onWrong` и добавить `pickWrongText`:

```js
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
```

- [ ] **Step 3: Добавить CSS тряски и скрытия**

В `css/styles.css` добавить:

```css
.hidden { display: none; }
.feedback { margin: 12px 0; min-height: 1.2em; }
.feedback.ok { color: #7CFC7C; }
.feedback.bad { color: #ff6b6b; }

@keyframes shake {
  10%,90% { transform: translateX(-2px); }
  20%,80% { transform: translateX(4px); }
  30%,50%,70% { transform: translateX(-8px); }
  40%,60% { transform: translateX(8px); }
}
.shake { animation: shake .4s; }
```

- [ ] **Step 4: Проверить оба потока**

Run: `#/stage/1`, ввести `xxx`
Expected: поле трясётся, красный текст из `wrongTexts` (случайный при повторах), поле не очищено.
Затем ввести `старт`
Expected: поле ввода скрылось, зелёный `correctText`, кнопка «Дальше →». Тап → `#/stage/2`.

- [ ] **Step 5: Проверить финальный этап**

Run: пройти до `#/stage/5`, ввести `победа`
Expected: показан `correctText` с адресом, кнопки «Дальше» НЕТ.

- [ ] **Step 6: Commit**

```bash
git add js/quest.js css/styles.css
git commit -m "feat: потоки верного и неверного ответа"
```

---

### Task 6: Оформление (mobile-first, тёмная тема, переход)

**Files:**
- Modify: `css/styles.css`

**Interfaces:**
- Consumes: разметку из `renderWelcome`/`renderStage` (классы `.screen`, `.primary`, `.code-input`, `.clue`, `.text`, `.hint`).

- [ ] **Step 1: Заменить styles.css на полный набор стилей**

```css
:root {
  color-scheme: dark;
  --bg: #0f1115;
  --card: #181b22;
  --fg: #eaeaea;
  --muted: #9aa0aa;
  --accent: #ffb300;
  --accent-fg: #1a1a1a;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
}

#app {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  padding: 24px 16px calc(24px + env(safe-area-inset-bottom));
}

.screen {
  width: 100%;
  max-width: 520px;
  margin: auto;
  background: var(--card);
  border-radius: 16px;
  padding: 24px 20px;
  animation: fade-in .35s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

h1 { font-size: 1.6rem; margin: 0 0 12px; }
.text { font-size: 1.05rem; margin-bottom: 20px; }
.clue { width: 100%; border-radius: 12px; margin-bottom: 16px; }

.answer-block { display: flex; flex-direction: column; gap: 12px; }

.code-input {
  width: 100%;
  font-size: 1.1rem;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #2a2f3a;
  background: #0f1218;
  color: var(--fg);
}
.code-input:focus { outline: 2px solid var(--accent); border-color: var(--accent); }

.primary {
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 15px 16px;
  border: none;
  border-radius: 12px;
  background: var(--accent);
  color: var(--accent-fg);
  cursor: pointer;
}
.primary:disabled { opacity: .45; cursor: default; }
.primary:active:not(:disabled) { transform: scale(.98); }

.hint { margin-top: 16px; color: var(--muted); }
.hint summary { cursor: pointer; }

.hidden { display: none; }
.feedback { margin: 14px 0; min-height: 1.2em; font-weight: 600; }
.feedback.ok { color: #7CFC7C; }
.feedback.bad { color: #ff6b6b; }

@keyframes shake {
  10%,90% { transform: translateX(-2px); }
  20%,80% { transform: translateX(4px); }
  30%,50%,70% { transform: translateX(-8px); }
  40%,60% { transform: translateX(8px); }
}
.shake { animation: shake .4s; }

#next-block { margin-top: 16px; }
```

- [ ] **Step 2: Проверить на мобильной ширине**

Run: DevTools → device toolbar (iPhone/Android), пройти welcome → этап → верный ответ
Expected: карточка по центру, крупные кнопки на всю ширину, читаемо, без горизонтального скролла, плавное появление экрана.

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "style: mobile-first тёмная тема и анимации"
```

---

### Task 7: QR-коды и деплой на GitHub Pages

**Files:**
- Create: `README.md`
- Create: `qr/` (папка с PNG, генерится при выполнении)

**Interfaces:**
- Consumes: развёрнутый URL сайта GitHub Pages.

- [ ] **Step 1: Написать README с деплоем и QR**

`README.md`:

```markdown
# Квест на мальчишник

Статический сайт (vanilla JS), хостинг на GitHub Pages. Сборки нет.

## Локальный запуск

    npm run serve

Открыть показанный `http://localhost:PORT`.

## Контент

Все загадки, коды и тексты — в `js/stages.js`. Правь там.

## Деплой на GitHub Pages

1. Запушить в репозиторий на GitHub.
2. Settings → Pages → Source: `Deploy from a branch`, ветка `main` (или `master`), папка `/ (root)`.
3. Сайт будет на `https://<user>.github.io/<repo>/`.

## QR-коды

QR ведёт на конкретный этап:
`https://<user>.github.io/<repo>/#/stage/3`

Генерация PNG (пример через публичный сервис-картинку, вставить в браузер):
`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=<URL-этапа>`

Сохранить PNG в `qr/stage-3.png`, распечатать, спрятать в реале.
```

- [ ] **Step 2: Сгенерировать QR для 5 этапов**

Для каждого этапа id=1..5 открыть в браузере (подставив реальный `<user>/<repo>`):
`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=https://<user>.github.io/<repo>/%23/stage/1`
(`%23` = `#`). Сохранить как `qr/stage-1.png` … `qr/stage-5.png`.

Примечание: URL станут финальными только после первого пуша (известно имя репозитория/пользователя). Допустимо выполнить этот шаг после Step 4.

- [ ] **Step 3: Commit README**

```bash
git add README.md qr
git commit -m "docs: README с деплоем и QR-кодами"
```

- [ ] **Step 4: Запушить и включить Pages**

```bash
git push -u origin master
```

Затем в GitHub: Settings → Pages → ветку в root. Проверить открытие `https://<user>.github.io/<repo>/` на телефоне: стартовый экран → пройти квест целиком.

Expected: сайт открывается на телефоне, все 5 этапов проходятся, QR-ссылки ведут на нужные этапы.

---

## Self-Review

**Покрытие спека:**
- Стартовый экран (`welcome`) — Task 2 (данные) + Task 3 (рендер). ✓
- 5 этапов, линейно — Task 2. ✓
- Модель этапа (все поля) — Task 2 интерфейс + Task 4/5 использование. ✓
- Ввод кода (A), нормализация — Task 4. ✓
- Верный ответ → `correctText` + кнопка «Дальше» — Task 5. ✓
- Неверный → случайный `wrongTexts` + тряска, поле не чистим — Task 5. ✓
- Пустой ввод → кнопка неактивна — Task 4. ✓
- Битый hash → редирект на этап 1 — Task 4. ✓
- Финальный этап (нет `next`) — Task 2 (данные) + Task 5 (нет кнопки). ✓
- Hash-роутинг, `#/welcome`, `#/stage/<id>` — Task 3/4. ✓
- QR (C) как ссылки на этапы — Task 7. ✓
- Mobile-first, тёмная тема, анимации — Task 6. ✓
- Без сборки, удаление TS-болванки — Task 1. ✓
- Деплой на GitHub Pages — Task 7. ✓
- Тип D — вне объёма (задел через поле `type`), в плане не реализуется. ✓ (соответствует спеку)

**Плейсхолдеры:** тексты загадок намеренно черновые (вариант B — дорабатываются пользователем); коды реальные, поведение полностью определено. Технических TODO в коде нет.

**Консистентность типов:** `normalize`, `checkAnswer`, `findStage`, `go`, `onCorrect`, `onWrong`, `pickWrongText`, `renderWelcome`, `renderStage`, `render`, `parseHash` — имена совпадают между задачами. `window.QUEST.{welcome,stages}` — единый контракт данных.

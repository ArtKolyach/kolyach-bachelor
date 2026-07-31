window.QUEST = {
  welcome: {
    title: "Бесконечное лето",
    text: "Именно таким оно казалось, пока мы были на даче",
    buttonText: "Погнали",
    // bg — свой фон-паттерн страницы (тайл), путь относительно index.html,
    // напр. "img/bg-welcome.png". Пусто/нет → глобальный дефолт из CSS.
    bg: ""
  },
  stages: [
    {
      id: 1,
      title: "Здесь был корабль",
      riddle: `Без воды,
без моря и без флага.
Ты был здесь капитан, а я —
матрос и вся ватага.

Скажи, что нынче там стоит,
где было наше судно?
Ответишь — путь тебе открыт,
не вспомнишь — станет трудно.`,
      image: "img/bottle.webp",  // опц. картинка, показывается сверху этапа ДО верного ответа
      answer: "Мангал",
      next: 2,
      wrongTexts: ["Якорь не в бухту!", "Тысяча чертей!"],
      correctText: "Ахой!",
      correctImage: "img/ship.jpeg",  // опц. картинка, показывается после верного ответа
      bg: ""   // свой фон этапа, напр. "img/bg-stage1.png"
    },
    {
      id: 2,
      title: "Где же я это видел...",
      image: "img/dendy.png",
      next: 3,
      riddle: 'Придётся поискать',
      correctImage: "img/gs.jpg",
      bg: ""
    },
    {
      id: 3,
      title: "Местный деликатес",
      riddle: "Поговаривают, там водятся устрицы",
      image: "img/clam.webp",
      next: 4,
      bg: ""
    },
    {
      id: 4,
      title: "Пристанище",
      riddle: "Сгодится как для самокрутки, так и для Мохито",
      image: "img/bonfire.webp",
      next: 5,
      bg: ""
    },
    {
      id: 5,
      title: "Тук-тук-тук",
      riddle: "Там мы считали до сотни",
      image: "img/ping-pong.webp",
      next: 6,
      bg: ""
    },
    {
      id: 6,
      title: "Не в том месте, не в то время",
      riddle: "За такие выходки угрожают колотушкой",
      image: "img/bat.png",
      next: 7,
      bg: ""
    },
    {
      id: 7,
      title: "Grove Street, home...",
      riddle: "Что гласит вывеска с обратной стороны пейзажа? Вернись и вспомни",
      image: "img/lot.jpg",
      answer: "The Pig Pen",
      wrongTexts: ["All you had to do was remember the damn place, CJ!"],
      correctText: "MISSION PASSED!\nRESPECT+",
      correctImage: "img/gs.jpg",
      bg: ""
      // next отсутствует → последний этап; кнопка ведёт на страницу финала
    }
  ],
  finish: {
    title: "Готово! 🎉",
    text: "Ты прошёл все испытания. С мальчишником, брат! 🥂",
    image: "",  // опционально: путь к фото/мему, напр. "img/finish.jpg"
    bg: ""      // свой фон финала, напр. "img/bg-finish.png"
  }
};

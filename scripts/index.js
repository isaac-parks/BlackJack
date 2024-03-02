const eventQueue = [];

function createEvents(player, dealer) {
  const newGameBtn = document.querySelector("#newgame-btn");
  const drawBtn = document.querySelector("#draw-btn");
  const standBtn = document.querySelector("#stand-btn");
  const oneBtn = document.querySelector("#one");
  const tenBtn = document.querySelector("#ten");
  const oneHundredBtn = document.querySelector("#onehundred");
  const fiveHundredBtn = document.querySelector("#fivehundred");
  //click new game button - refreshes player/dealer hand, sets player alive
  oneBtn.addEventListener(
    "click",
    registerEvent("adjustBet", { amount: 1, player: player })
  );

  tenBtn.addEventListener(
    "click",
    registerEvent("adjustBet", { amount: 10, player: player })
  );

  oneHundredBtn.addEventListener(
    "click",
    registerEvent("adjustBet", { amount: 100, player: player })
  );

  fiveHundredBtn.addEventListener(
    "click",
    registerEvent("adjustBet", { amount: 500, player: player })
  );

  drawBtn.addEventListener(
    "click",
    registerEvent("draw", { player: player, dealer: dealer })
  );

  standBtn.addEventListener(
    "click",
    registerEvent("checkPlayerWin", { player: player, dealer: dealer })
  );

  newGameBtn.addEventListener(
    "click",
    registerEvent("createNewGame", { player: player, dealer: dealer })
  );
}

function registerEvent(name, args) {
  const events = {
    createNewGame: createNewGame,
    draw: draw,
    checkPlayerWin: checkPlayerWin,
    adjustBet: adjustBet,
    changeMessageDisplay: changeMessageDisplay,
  };

  return () => pushToQueue(events[name], args);
}

function pushToQueue(event, args = {}) {
  for (const [arg, val] of Object.entries(args)) {
    eventQueue.push({ [arg]: val, type: "argument" });
  }
  eventQueue.push(event);
}

function checkEventQueue() {
  return !!eventQueue.length;
}

function executeEvent() {
  const args = {};
  while (true) {
    const event = eventQueue.shift();
    if (event.type && event.type === "argument") {
      delete event.type;
      Object.assign(args, event);
      continue;
    }
    return event(args);
  }
}

function loop(player, dealer, itr) {
  let reset;
  while (checkEventQueue()) {
    reset = executeEvent();
  }

  refreshUI({ player, dealer });
  itr(reset);
}

function startMain(player = {}, dealer = {}, initialize = false) {
  if (initialize) {
    ("resetting");
    delete player;
    delete dealer;
    [player, dealer] = init();
    createEvents(player, dealer);
  }
  const callback = (reset) => startMain(player, dealer, reset);

  setTimeout(() => loop(player, dealer, callback), 0);
}

startMain({}, {}, init);

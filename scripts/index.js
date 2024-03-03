// TODO: refactor to use some sort of state management
let eventQueue = [];
let clearEvents = () => {};
function createEvents(player, dealer) {
  const newGameBtn = document.querySelector("#newgame-btn");
  const drawBtn = document.querySelector("#draw-btn");
  const standBtn = document.querySelector("#stand-btn");
  const oneBtn = document.querySelector("#one");
  const tenBtn = document.querySelector("#ten");
  const oneHundredBtn = document.querySelector("#onehundred");
  const fiveHundredBtn = document.querySelector("#fivehundred");

  const eventListeners = [
    {
      element: oneBtn,
      event: "click",
      handler: registerEvent("adjustBet", { amount: 1, player }),
    },
    {
      element: tenBtn,
      event: "click",
      handler: registerEvent("adjustBet", { amount: 10, player }),
    },
    {
      element: oneHundredBtn,
      event: "click",
      handler: registerEvent("adjustBet", { amount: 100, player }),
    },
    {
      element: fiveHundredBtn,
      event: "click",
      handler: registerEvent("adjustBet", { amount: 500, player }),
    },
    {
      element: drawBtn,
      event: "click",
      handler: registerEvent("draw", { player, dealer }),
    },
    {
      element: standBtn,
      event: "click",
      handler: registerEvent("checkPlayerWin", { player, dealer }),
    },
    {
      element: newGameBtn,
      event: "click",
      handler: registerEvent("createNewGame", { player, dealer }),
    },
  ];

  eventListeners.forEach(({ element, event, handler }) => {
    element.addEventListener(event, handler);
  });

  function clearEvents() {
    eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
  }

  return clearEvents;
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

async function executeEvent() {
  const args = {};
  while (true) {
    const event = eventQueue.shift();
    if (event.type && event.type === "argument") {
      delete event.type;
      Object.assign(args, event);
      continue;
    }
    return await event(args);
  }
}

async function tick(player, dealer, itr) {
  let reset;
  while (checkEventQueue()) {
    reset = await executeEvent();
    if (reset) eventQueue = [];
    refreshUI({ player, dealer });
  }

  await itr(reset);
}

async function startMain(player = {}, dealer = {}, initialize = false) {
  // TODO: going to have to refactor player/dealer bc it sucks
  if (initialize) {
    clearEvents();
    delete player;
    delete dealer;
    [player, dealer] = init();
    clearEvents = createEvents(player, dealer);
  }
  const callback = async (reset) => await startMain(player, dealer, reset);

  setTimeout(async () => await tick(player, dealer, callback), 100);
}

startMain({}, {}, true);

let currentMessage = document.querySelector("#messages");
let betText = document.querySelector("#current-bet");
let chipsText = document.querySelector("#chips");
let playerValue = document.querySelector("#player");
let dealerValue = document.querySelector("#dealer");
let playerChips = document.querySelector("#chips");
let dealerCardBox = document.querySelector("#dealer-cards-container");
let cardBox = document.querySelector("#player-cards-container");

function init() {
  let player = new Person(false);
  let dealer = new Person(true);

  let chips = localStorage.getItem("chips");
  chips = chips ? chips : 2000;
  player.chips = chips;

  localStorage.setItem("chips", 100000);
  pushToQueue(changeMessageDisplay, {
    text: "Welcome! Place Your Bet To Start The Game!",
  });
  return [player, dealer];
}

function createNewGame({ player, dealer }) {
  if (!player.isAlive && player.currentBet > 0) {
    pushToQueue(startGame, { player: player, dealer: dealer });
  } else if (player.isAlive) {
    pushToQueue(changeMessageDisplay, {
      text: `Oak's words echoed... "There's a time and place for everything but not now!"`,
    });
  } else {
    pushToQueue(changeMessageDisplay, {
      text: "You Must Place A Bet First!",
    });
  }
}

function startGame({ player, dealer }) {
  player.cards = [];
  dealer.cards = [];
  player.isAlive = true;
  player.drawCard(2);
  dealer.drawCard();
  pushToQueue(checkDraw, { player, dealer });
}

function changeMessageDisplay({ text }) {
  currentMessage.textContent = text;
}

function adjustBet({ amount, player }) {
  if (!player.isAlive && player.chips > 0) {
    player.adjustCurrentBet(amount);

    return;
  }

  pushToQueue(changeMessageDisplay, {
    text: `Oak's words echoed... "There's a time and place for everything but not now!"`,
  });
}

function checkPlayerWin({ player, dealer }) {
  const playerSum = player.getSum();
  while (player.isAlive) {
    dealer.drawCard();
    const dealerSum = dealer.getSum();

    if (dealerSum < 17) {
      continue;
    }

    player.isAlive = false;

    if (dealerSum > 21) {
      pushToQueue(changeMessageDisplay, {
        text: "🎉 YOU WON! Resetting... 🎉",
      });
      player.win = true;
      pushToQueue(gameOver, { player, dealer });
      break;
    } else if (dealerSum === playerSum) {
      player.chips += player.currentBet;
      player.currentBet = 0;
      pushToQueue(changeMessageDisplay, {
        text: "Looks Like It's a Draw! Resetting...",
      });
      player.win = "push";
      pushToQueue(gameOver, { player, dealer });
      break;
    } else if (dealerSum == 21 || dealerSum > playerSum) {
      pushToQueue(changeMessageDisplay, {
        text: "Sorry... Looks Like I Won This Time. 😞 Resetting...",
      });
      player.win = false;
      pushToQueue(gameOver, { player, dealer });
      break;
    } else if (playerSum > dealerSum) {
      pushToQueue(changeMessageDisplay, {
        text: "🎉 YOU WON! Resetting.... 🎉",
      });
      player.win = true;
      pushToQueue(gameOver, { player, dealer });
      break;
    }
  }
}

function draw({ player, dealer }) {
  if (player.isAlive) {
    player.drawCard();
    pushToQueue(checkDraw, { player, dealer });
  }
}

function checkDraw({ player, dealer }) {
  const playerSum = player.getSum();
  const dealerSum = dealer.getSum();
  if (playerSum < 21 && dealerSum < 17) {
    pushToQueue(changeMessageDisplay, {
      text: "Would you like to stand or draw a card?",
    });

    return;
  } else if (playerSum === 21) {
    pushToQueue(changeMessageDisplay, {
      text: `🎉 YOU HIT A BLACKJACK! Resetting... 🎉`,
    });
    player.isAlive = false;
    player.win = true;
  } else if (playerSum > 21) {
    pushToQueue(changeMessageDisplay, {
      text: "Sorry... Looks Like You Went Over 21. 😞 Resetting...",
    });

    player.isAlive = false;
    player.win = false;
  }

  if (!player.isAlive) {
    pushToQueue(gameOver, { player, dealer });
  }
}

async function gameOver({ player, dealer }) {
  if (player.win === 'push') {
    player.chips += player.currentBet;
  }
  else if (player.win) {
    player.chips += player.currentBet * 2;
  }

  localStorage.setItem("chips", player.chips);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return true;
}

function refreshUI({ player, dealer }) {
  player.renderHand();
  dealer.renderHand();
  chipsText.textContent = `${player.chips}`;
  betText.textContent = `${player.currentBet}`;

  playerValue.innerHTML = `${player.hand} <p>(total: ${player.getSum()})</p>`;
  dealerValue.innerHTML = `${dealer.hand} <p> (total: ${dealer.getSum()})</p>`;
}

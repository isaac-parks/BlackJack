let currentMessage = document.querySelector("#messages");
let betText = document.querySelector("#current-bet");
let chipsText = document.querySelector("#chips");
let playerValue = document.querySelector("#player");
let dealerValue = document.querySelector("#dealer");
let playerChips = document.querySelector("#chips");
let dealerCardBox = document.querySelector("#dealer-cards-container");
let cardBox = document.querySelector("#player-cards-container");

function init() {
  const player = new Person(false);
  const dealer = new Person(true);

  let chips = localStorage.getItem("chips");
  chips = chips ? chips : 2000;
  player.chips = chips;

  localStorage.setItem("chips", chips);

  return [player, dealer];
}

function createNewGame({ player, dealer }) {
  if (!player.isAlive && player.currentBet > 0) {
    pushToQueue(startGame, { player: player, dealer: dealer });
  } else if (player.isAlive) {
    pushToQueue(changeMessageDisplay, {
      text: `"Oak's words echoed... "There's a time and place for everything but not now!"`,
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
}

function changeMessageDisplay({ text }) {
  currentMessage.textContent = text;
}

function adjustBet({ amount, player }) {
  if (!player.isAlive && player.chips > 0) {
    player.adjustCurrentBet(amount);
    player.chips -= amount;

    return;
  }

  pushToQueue(changeMessageDisplay, {
    text: `Oak's words echoed... "There's a time and place for everything but not now!"`,
  });
}

function checkPlayerWin({ player, dealer }) {
  while (player.isAlive) {
    dealer.drawCard();
    const dealerSum = dealer.getSum();
    const playerSum = player;
    if (dealerSum === playerSum) {
      if (dealerSum < 21 && dealerSum > 17) {
        player.isAlive = false;
        player.chips += player.currentBet;
        player.currentBet = 0;
        pushToQueue(currentMessage, {
          text: "Looks Like It's a Draw! Press New Game to Play Again.",
        });
        pushToQueue(gameOver, { player, dealer });
        break;
      }
    } else if (dealerSum <= 21 && dealerSum > playerSum) {
      if (dealerSum >= 17) {
        pushToQueue(changeMessageDisplay, {
          text: "Sorry... Looks Like I Won This Time. 😞 Press New Game to Play Again!",
        });
        player.isAlive = false;
        player.win = "push";
        pushToQueue(gameOver, { player, dealer });
        break;
      } else {
        continue;
      }
    } else if (dealerSum < 17 && dealerSum < playerSum) {
      continue;
    } else {
      pushToQueue(changeMessageDisplay, {
        text: "🎉 YOU WON! Resetting.... 🎉",
      });
      player.isAlive = false;
      player.win = true;
      pushToQueue(gameOver, { player, dealer });
      break;
    }
  }
}

function draw({ player, dealer }) {
  if (player.isAlive) {
    player.drawCard();
    player.renderCard();
  }

  pushToQueue(checkDraw, { player, dealer });
}

function checkDraw({ player, dealer }) {
  if (!player.isAlive) {
    return;
  }

  if (player.getSum() < 21 && dealer.getSum() < 17) {
    pushToQueue(changeMessageDisplay, {
      text: "Would you like to stand or draw a card?",
    });
  } else if (player.getSum() === 21) {
    pushToQueue(changeMessageDisplay, {
      text: `🎉 YOU HIT A BLACKJACK! Resetting... 🎉`,
    });

    player.isAlive = false;
    player.win = true;
  } else if (player.getSum() > 21) {
    pushToQueue(changeMessageDisplay, {
      text: "Sorry... Looks Like You Went Over 21. 😞 Press New Game to Play Again!",
    });

    player.isAlive = false;
    player.win = false;
  }

  if (!player.isAlive) {
    pushToQueue(gameOver, { player, dealer });
  }
}

function gameOver({ player, dealer }) {
  if (player.win) {
    player.chips += player.currentBet * 2;
  } else if (player.win === "push") {
    player.chips += player.currentBet;
  }

  localStorage.setItem("chips", player.chips);

  return true;
}

function refreshUI({ player, dealer }) {
  player.renderCard();
  dealer.renderCard();
  chipsText.textContent = `${player.chips}`;
  betText.textContent = `${player.currentBet}`;

  playerValue.innerHTML = `${player.hand} <p>(total: ${player.getSum()})</p>`;
  dealerValue.innerHTML = `${dealer.hand} <p> (total: ${dealer.getSum()})</p>`;
}

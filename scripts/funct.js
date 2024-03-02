//starts new game
let renderGame = () => {
  player.cards = [];
  dealer.cards = [];
  player.isAlive = true;
  player.drawCard(2);
  player.renderCard();
  dealer.drawCard();
  dealer.renderCard(true);
  refreshUI();
  refreshUI((human = false));
  gameStatus();
};

//checks whether or not the player is over 21. runs every time draw is pushed.  if over 21,  sets player alive to false (doesn't allow them to click anything)
gameStatus = () => {
  if (player.isAlive) {
    refreshUI();
    refreshUI((human = false));
    if (player.getSum() < 21) {
      currentMessage.innerText = "Would you like to stand or draw a card?";
    } else if (player.getSum() === 21) {
      currentMessage.innerText =
        "NICE!!!! 🎉 YOU HIT A BLACKJACK! Press New Game to Play Again.";
      player.isAlive = false;
      player.win = true;
      player.checkWin();
    } else {
      currentMessage.innerText =
        "Dang! You Busted. 😞 Press New Game to Try Again.";
      player.isAlive = false;
      player.checkWin();
    }
  }
};

//update player and dealer hands
refreshUI = (human = true) => {
  chipsText.textContent = `${player.chips}`;
  betText.textContent = `${player.currentBet}`;
  if (player.isAlive) {
    if (human) {
      playerValue.innerHTML = `${
        player.hand
      } <p>(total: ${player.getSum()})</p>`;
    } else {
      dealerValue.innerHTML = `${dealer.hand} <p> (total: ${dealer.getSum(
        (human = false)
      )})</p>`;
    }
  }
};

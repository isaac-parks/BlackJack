// This is quite literally the ugliest and worst way to do this, but I'm keeping it to stay true to the way I originally made it since it was my first project ever <3
class Person {
  constructor(isDealer) {
    this.hand = [];
    this.cards = []; // TODO: not needed
    this.dealer = isDealer;
    if (!this.dealer) {
      this.isAlive = false;
      this.chips = 0;
      this.win = null;
      this.currentBet = 0;
      this.adjustCurrentBet = (value) => {
        this.currentBet += value;
        this.chips -= value;
        if (this.chips < 0) {
          let retract = this.chips - 0;
          this.currentBet += retract;
          this.chips = 0;
        }
      };
    }
    this.drawCard = (number = 1) => {
      if (player.isAlive) {
        dealerCardBox.style.opacity = "1";
      }
      if (player.isAlive) {
        cardBox.style.opacity = "1";
      }
      for (let i = 0; i < number; i++) {
        this.hand.push(Math.floor(Math.random() * 10 + 2));
      }

      if (this.getSum() > 21) {
        if (this.hand.indexOf(11) != -1) {
          this.hand[this.hand.indexOf(11)] = 1;
        }
      }

      this.renderHand();
    };

    this.renderHand = () => {
      for (let i = this.cards.length; i < this.hand.length; i++) {
        const index = this.hand[i] - 2 >= 0 ? this.hand[i] - 2 : 9; //  temp fix for rendering aces (this whole thing needs rework)
        const r = Math.floor(Math.random() * images[index].length);
        this.cards.push(images[index][r]);
      }

      if (!this.dealer) {
        let cardBox = document.querySelector("#player-cards-container");
        cardBox.innerHTML = this.cards.join(" ");
        return;
      }

      dealerCardBox = document.querySelector("#dealer-cards-container");
      dealerCardBox.innerHTML = this.cards.join(" ");
    };

    this.getSum = () => {
      let sum = 0;
      for (let card of this.hand) {
        sum += card;
      }
      return sum;
    };

    this.renderHand();
  }
}

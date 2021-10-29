//constructing an object to store player and dealer keys
class Person {
    constructor() {
        this.hand = []
        this.cards= []
        this.drawCard = function (number = 1, dealer= false) {
            if (player.isAlive){dealerCardBox.style.opacity = "1"}
            if (player.isAlive){cardBox.style.opacity = "1"}
            for (let i = 0; i < number; i++) {
                this.hand.push(Math.floor((Math.random() * 10) + 2))
            }
        }

        this.renderCard = function (dealer = false){
            console.log(this.cards.length)
            for(let i = this.cards.length; i < this.hand.length; i++) {
                index = this.hand[i] - 2
                this.cards.push(images[index][Math.floor(Math.random() * images[index].length)])
            }
            if (!dealer) {
                let cardBox = document.querySelector("#player-cards-container")
                cardBox.innerHTML = this.cards.join(' ')
            } else if (dealer){
                dealerCardBox = document.querySelector("#dealer-cards-container")
                dealerCardBox.innerHTML = this.cards.join(' ')
            }
        }

        this.getSum = function () {
            let sum = 0
            for (let i = 0; i < this.hand.length; i++) {
                sum += this.hand[i] 
            }
            for (let i = 0; i < this.hand.length; i++){
                if (this.hand[i] === 11 && sum > 21) {
                    sum -= this.hand[i]
                    this.hand[i] = 1
                    sum += this.hand[i]
                }
            }
            return sum
        }
    }       
}
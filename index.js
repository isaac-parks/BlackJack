//constructing an object to store player and dealer keys
class Person {
    constructor() {
        this.hand = []
        this.drawCard = function (number = 1) {
            for (let i = 0; i < number; i++) {
                this.hand.push(Math.floor((Math.random() * 10) + 2))
            }
        }
        this.getSum = function (human = true) {
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

//creating player/dealer objects and player alive variable
let player = new Person()
let dealer = new Person() 
player.isAlive = false;

let currentMessage = document.querySelector("#messages")
let playerValue = document.querySelector("#player")
let dealerValue = document.querySelector("#dealer")

//<button id="newgame-btn">NEW GAME</button>
//<h2 class= "chips">Chips: </h2>
//<h2 class= "bet">Bet: </h2>
//<button id="draw-btn">DRAW</button>
//button id="stand-btn">STAND</button>

const newGameBtn = document.querySelector("#newgame-btn")
const drawBtn = document.querySelector("#draw-btn")
const standBtn = document.querySelector("#stand-btn")

//gives initial conditions, only ran when newbutton is pushed
let renderGame = () => {
    player.isAlive = true
    player.drawCard(2)
    dealer.drawCard()
    changeCounter()
    changeCounter(human = false)
    gameStatus()
}

//click new game button - refreshes player/dealer hand, sets player alive
newGameBtn.addEventListener("click", () => {
    document.querySelector("#sub-head").textContent = ""
    player.hand = new Array()
    dealer.hand = new Array()
    player.isAlive = true;
    renderGame();
})

//click draw button, only works if player is alive, player draws a card, updates UI, checks game status
drawBtn.addEventListener("click", () =>{
    if (player.isAlive) {
        player.drawCard()
        changeCounter()
        gameStatus()
    }
})

standBtn.addEventListener("click", () =>{
    if (player.isAlive) {
        while (player.isAlive) {
            dealer.drawCard()
            changeCounter(false)
            if (dealer.getSum(human = false) === player.getSum()) {
                if (dealer.getSum(human = false) < 21 && dealer.getSum(human = false) > 17) {
                player.isAlive = false
                currentMessage.textContent = "Looks Like It's a Draw! Press New Game to Play Again."
                break
                }
            }
            else if (dealer.getSum(human = false) <= 21 && dealer.getSum(human = false) > player.getSum()) {
                if (dealer.getSum(human = false) >= 17) {
                    currentMessage.textContent = "Sorry... Looks Like I Won This Time. 😞 Press New Game to Play Again!"
                    player.isAlive = false;
                    break
                }
                else {
                    continue
                }
            } else if (dealer.getSum(human = false) < 17 && dealer.getSum(human = false) < player.getSum()) {
                continue
            } else if (dealer.getSum(human = false) < 17 && dealer.getSum(human = false) < player.getSum()) {
                continue
            } else {
                currentMessage.textContent = "NICE!!!! 🎉 YOU WON! Press New Game to Play Again."
                player.isAlive = false; 
                break
            }
        } 
    }
})

//checks whether or not the player is over 21. runs every time draw is pushed.  if over 21,  sets player alive to false (doesn't allow them to click anything)
gameStatus = () => { 
    if (player.isAlive){
        changeCounter();
        changeCounter(human=false)
        if (player.getSum() < 21) {
            currentMessage.innerText = "Would you like to stand or draw a card?"
        } else if (player.getSum() === 21) {
            currentMessage.innerText = "NICE!!!! 🎉 YOU HIT A BLACKJACK! Press New Game to Play Again."
            player.isAlive = false;
        } else { 
            currentMessage.innerText = "Dang! You Busted. 😞 Press New Game to Try Again."
            player.isAlive = false;
        }
    } 
}   

//update player and dealer hands
changeCounter = (human=true) => {
    if (human) {
        playerValue.innerHTML = `Player: ${player.hand} <br>(total: ${player.getSum()})`
    }
    else {
        dealerValue.innerHTML = `Dealer:  ${dealer.hand} <br> (total: ${dealer.getSum(human = false)})`
    }
}

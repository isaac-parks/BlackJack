let images = []
index = 0
images[0] = "<img src= '../cards/ace.svg' alt= 'card'>"
images[1] = "<img src= '../cards/two.svg' alt= 'card'>"
images[2] = "<img src= '../cards/three.svg' alt= 'card'>"
images[3] = "<img src= '../cards/four.svg' alt= 'card'>"
images[4] = "<img src= '../cards/five.svg' alt= 'card'>"
images[5] = "<img src= '../cards/six.svg' alt= 'card'>"
images[6] = "<img src= '../cards/seven.svg' alt= 'card'>"
images[7] = "<img src= '../cards/eight.svg' alt= 'card'>"
images[8] = "<img src= '../cards/nine.svg' alt= 'card'>"
images[9] = "<img src= '../cards/ten.svg' alt= 'card'>"
images[10] = "<img src= '../cards/eleven.svg' alt= 'card'>"
images[11] = "<img src= '../cards/twelve.svg' alt= 'card'>"
images[12]= "<img src= '../cards/thirteen.svg' alt= 'card'>"

let images2 = images

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
player.isAlive = false
player.chips = 0
player.win = null
player.currentBet = 0 
player.checkWin = () => {
    if (player.win) {
        player.chips += (player.currentBet * 2)
        player.currentBet = 0
        player.win = null
        localStorage.setItem("chips", player.chips)
        refreshUI()
    }
    else {
        player.chips
        player.currentBet = 0
        player.win = null
        localStorage.setItem("chips", player.chips)
        refreshUI()
    }
}

player.adjustCurrentBet = (value) => {
    return player.currentBet += value
}



if (localStorage.getItem("chips")) {
    player.chips = localStorage.getItem("chips")
}

else { 
    player.chips = 2000
    localStorage.setItem("chips", player.chips)
}


let currentMessage = document.querySelector("#messages")
let betText = document.querySelector("#current-bet")
let chipsText = document.querySelector("#chips")
chipsText.textContent = `Chips: ${player.chips}`
let playerValue = document.querySelector("#player")
let dealerValue = document.querySelector("#dealer")
let playerChips = document.querySelector("#chips")


//<button id="newgame-btn">NEW GAME</button>
//<h2 class= "chips">Chips: </h2>
//<h2 class= "bet">Bet: </h2>
//<button id="draw-btn">DRAW</button>
//button id="stand-btn">STAND</button>

const newGameBtn = document.querySelector("#newgame-btn")
const drawBtn = document.querySelector("#draw-btn")
const standBtn = document.querySelector("#stand-btn")
const oneBtn = document.querySelector("#one")
const tenBtn = document.querySelector("#ten")
const oneHundredBtn = document.querySelector("#onehundred")
const fiveHundredBtn = document.querySelector("#fivehundred")
//gives initial conditions, only ran when newbutton is pushed

//click new game button - refreshes player/dealer hand, sets player alive
oneBtn.addEventListener("click", () => {
    if (!player.isAlive) {
        if (player.chips > 0) {
            let bet = player.adjustCurrentBet(1)
            player.chips--
            
        }
        if (player.chips < 0) {
            let retract = player.chips - 0
            player.currentBet += retract
            player.chips = 0
        }
    }
    refreshUI()
})

tenBtn.addEventListener("click", () => {
    if (!player.isAlive) {
        if (player.chips > 0) {
            let bet = player.adjustCurrentBet(10)
            player.chips -= 10
        
        }
        if (player.chips < 0) {
            let retract = player.chips - 0
            player.currentBet += retract
            player.chips = 0
        }
    }
    refreshUI()
})

oneHundredBtn.addEventListener("click", () => {
    if (!player.isAlive){
        if (player.chips > 0) {
            let bet = player.adjustCurrentBet(100)
            player.chips -= 100
            
        }
        if (player.chips < 0) {
            let retract = player.chips - 0
            player.currentBet += retract
            player.chips = 0
        }
    }
    refreshUI()

})

fiveHundredBtn.addEventListener("click", () => {
    if (!player.isAlive) {
        if (player.chips > 0) {
            let bet = player.adjustCurrentBet(500)
            player.chips -= 500
        }
        if (player.chips < 0) {
            let retract = player.chips - 0
            player.currentBet += retract
            player.chips = 0
        }
    }
    refreshUI()
})

newGameBtn.addEventListener("click", () => {
    console.log(player.isAlive)
    console.log(player.currentBet)
    if (player.isAlive == false && player.currentBet > 0) {
        player.hand = new Array()
        dealer.hand = new Array()
        player.isAlive = true;
        renderGame();
    } else if (player.isAlive === true) {
        currentMessage.textContent = `Oak's words echoed... "There's a time and place for everything but not now!"`
    } else {
        currentMessage.textContent = "You Must Place A Bet First!"
    }
})

//click draw button, only works if player is alive, player draws a card, updates UI, checks game status
drawBtn.addEventListener("click", () =>{
    if (player.isAlive) {
        player.drawCard()
        refreshUI()
        gameStatus()
    }
})
//stand logic (based on dealer)
standBtn.addEventListener("click", () =>{
    if (player.isAlive) {
        while (player.isAlive) {
            dealer.drawCard()
            refreshUI(false)
            if (dealer.getSum(human = false) === player.getSum()) {
                if (dealer.getSum(human = false) < 21 && dealer.getSum(human = false) > 17) {
                player.isAlive = false
                player.chips += player.currentBet
                player.currentBet = 0
                refreshUI()
                currentMessage.textContent = "Looks Like It's a Draw! Press New Game to Play Again."
                break
                }
            }
            else if (dealer.getSum(human = false) <= 21 && dealer.getSum(human = false) > player.getSum()) {
                if (dealer.getSum(human = false) >= 17) {
                    currentMessage.textContent = "Sorry... Looks Like I Won This Time. 😞 Press New Game to Play Again!"
                    player.checkWin()
                    player.isAlive = false;
                    localStorage.setItem("chips", player.chips)
                    refreshUI()
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
                player.win = true
                player.checkWin()
                localStorage.setItem("chips", player.chips)
                refreshUI()
                break
            }
        } 
    }
})

//starts new game
let renderGame = () => {
    player.isAlive = true
    player.drawCard(2)
    dealer.drawCard()
    refreshUI()
    refreshUI(human = false)
    gameStatus()
}

//checks whether or not the player is over 21. runs every time draw is pushed.  if over 21,  sets player alive to false (doesn't allow them to click anything)
gameStatus = () => { 
    if (player.isAlive){
        refreshUI();
        refreshUI(human=false)
        if (player.getSum() < 21) {
            currentMessage.innerText = "Would you like to stand or draw a card?"
        } else if (player.getSum() === 21) {
            currentMessage.innerText = "NICE!!!! 🎉 YOU HIT A BLACKJACK! Press New Game to Play Again."
            player.isAlive = false;
            player.win = true
            player.checkWin()
        } else { 
            currentMessage.innerText = "Dang! You Busted. 😞 Press New Game to Try Again."
            player.isAlive = false;
            player.checkWin()
        }
    } 
}   

//update player and dealer hands
refreshUI = (human=true) => {
    chipsText.textContent = `Chips: ${player.chips}`
    betText.textContent = `Current Bet: ${player.currentBet}`
    if (player.isAlive) {
        if (human) {
            playerValue.innerHTML = `Your Hand: ${player.hand} <p>(total: ${player.getSum()})`
        }
        else {
            dealerValue.innerHTML = `Dealer's Hand:  ${dealer.hand} <p> (total: ${dealer.getSum(human = false)})`
        }
    }
}




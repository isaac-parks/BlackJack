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
chipsText.textContent = `${player.chips}`
let playerValue = document.querySelector("#player")
let dealerValue = document.querySelector("#dealer")
let playerChips = document.querySelector("#chips")
let dealerCardBox = document.querySelector("#dealer-cards-container")
let cardBox = document.querySelector("#player-cards-container")
if (!player.isAlive){dealerCardBox.style.opacity = "0"}
if (!player.isAlive){cardBox.style.opacity = "0"}
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
//click new game
newGameBtn.addEventListener("click", () => {
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
        player.renderCard()
        refreshUI()
        gameStatus()
    }
})
//stand logic (based on dealer)
standBtn.addEventListener("click", () =>{
    if (player.isAlive) {
        while (player.isAlive) {
            dealer.drawCard()
            dealer.renderCard(true)
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




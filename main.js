const gameTitle = document.querySelector(".game_title");
const gameHeader = document.querySelector(".game_header");
const gameField = document.querySelector(".game_field");
const fieldRect = gameField.getBoundingClientRect();
const startBtn = document.querySelector(".game_start_button");
const stopBtn = document.querySelector(".game_stop_button");
const gameTimer = document.querySelector(".game_timer");
const gameScore = document.querySelector(".game_score");
const popUp = document.querySelector(".pop-up");
const replayBtn = document.querySelector(".replay_button");
const popUpMessage = document.querySelector(".pop-up_message");

const HIDDEN_CLASS = "hidden";
const CARROT_URL = "./img/carrot.png";
const BUG_URL = "./img/bug.png";
const CARROT_SIZE = 80;
const BUG_SIZE = 50;
let SCORE_COUNTER = 0; // 남아있는 당근 개수를 세기 위한 변수
let GAME_STATE = false; // Timer를 제어하기 위한 게임 진행 상태 정의 게임진행 = true, 게임종료(미진행) = false

// Class for making img object of carrot and bug
class Item extends Image {
    constructor(imgName) {
        switch(imgName){
            case 'carrot':
                super(CARROT_SIZE, CARROT_SIZE);
                this.src = CARROT_URL;
                break;
            case 'bug':
                super(BUG_SIZE, BUG_SIZE);
                this.src = BUG_URL;
                break;
        }
        this.className = imgName;
    }
}

// make random coordinate of carrot and bug
function randomCoordinate(direction) {
    const x_min = fieldRect.left;
    const x_max = fieldRect.right-80;
    const y_min = fieldRect.top;
    const y_max = fieldRect.bottom-80;
    console.log(x_min,x_max,y_min,y_max);
    switch(direction) {
        case 'x':
            return Math.floor(Math.random()*(x_max-x_min)+x_min);
        case 'y':
            return Math.floor(Math.random()*(y_max-y_min)+y_min);
    }
}

// make img object of carrot and bug for displaying
function createItem(imgName, count) {
    for(let i=1; i<=count; i++) {
        const img = new Item(imgName);
        img.style.position = "absolute";
        img.style.left = `${randomCoordinate('x')}px`;
        img.style.top = `${randomCoordinate('y')}px`;
        gameField.appendChild(img);
    }
}

// handle click event of carrot and bug
function handleItem(event) {
    if(!GAME_STATE) return;
    const target = event.target;
    switch(target.className) {
        case 'carrot' :
            target.classList.add(HIDDEN_CLASS);
            SCORE_COUNTER--;
            gameScore.innerText = SCORE_COUNTER;
            if(SCORE_COUNTER === 0) gameOver("You won!");
            break;
        case 'bug' :
            gameOver("You lost😪");
            break;
    }
}

// set up for starting game
function setInitialState() {
    popUp.classList.add(HIDDEN_CLASS);
    gameTitle.classList.add(HIDDEN_CLASS);
    startBtn.classList.add(HIDDEN_CLASS);
    gameHeader.classList.remove(HIDDEN_CLASS);
    gameField.innerHTML = "";
}

// show total number of carrot
function setScore() {
    const carrots = document.querySelectorAll(".carrot");
    SCORE_COUNTER = carrots.length;
    gameScore.innerText = SCORE_COUNTER;
    GAME_STATE = true;
}

// game over
function gameOver(text) {
    popUp.classList.remove(HIDDEN_CLASS);
    popUpMessage.innerText = text;
    //gameField.removeEventListener("click", handleItem);
    GAME_STATE = false;
}

// handle timer when player starts game
function handleTimer() { 
    let GAME_DURATION_SEC = 10;
    gameTimer.innerText = `0:${GAME_DURATION_SEC}`;
    const timerId = setInterval(() => {
        if(GAME_STATE === false) { 
            clearInterval(timerId);
            return;
        } else if(GAME_DURATION_SEC === 0) {
            clearInterval(timerId);
            gameOver("You lost😪");
            return; 
        }
        gameTimer.innerText = `0:${--GAME_DURATION_SEC}`;
    },1000);
}

//start game
function startGame() {
    setInitialState();
    createItem('carrot', 15);
    createItem('bug', 10);
    setScore();
    handleTimer();
}

startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", () => gameOver("Replay?"));
replayBtn.addEventListener("click", startGame);
// 이벤트 위임을 사용해서 당근과 벌레에 직접적으로 eventListener를 주지 않고 game_field자체에 eventListener를 걸어줌
gameField.addEventListener("click", handleItem);




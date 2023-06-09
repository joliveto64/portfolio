import { hiTableData } from "./data.js";
import { loTableData } from "./data.js";
import { hiLoDieArray } from "./data.js";

const diceElement = document.querySelectorAll(".dice");
const rollBtn = document.getElementById("roll-btn");
const p1Element = document.querySelector(".player-1");
const p2Element = document.querySelector(".player-2");
const roundInfo = document.querySelector("#round-info");

let p1Score = 0;
let p2Score = 0;
let rollCount = 0;
let lockedCount = 0;
let isP1Turn;
let winningScore = 20;
let gameFinished = false;
let RollBtnIsClicked = false;

// INITIAL STATE ////////////////////////////////////////////
setInitialState();

// MAIN STUFF //////////////////////////////////////////////
handleLocks();

rollBtn.addEventListener("click", () => {
  RollBtnIsClicked = true;

  if (lockedCount === 6) {
    calculateScores();
    renderScores();
    checkWinCondition();
    switchPlayer();
  } else if (rollCount < 5 && lockedCount >= rollCount) {
    rollingAnimation();
    rollCount++;
    renderRandomDiceNumber();
    roundInfo.textContent = `roll: ${rollCount}/5`;
  }
});

// FUNCTIONS /////////////////////////////////////////////////

function renderRandomDiceNumber() {
  diceElement.forEach((die) => {
    if (!die.classList.contains("hi-lo") && !die.classList.contains("lock")) {
      die.textContent = Math.floor(Math.random() * 6) + 1;
    } else if (
      die.classList.contains("hi-lo") &&
      !die.classList.contains("lock")
    ) {
      let hiloRandom = hiLoDieArray[Math.floor(Math.random() * 6)];
      die.innerHTML = hiloRandom[0];
      die.dataset.hilo = hiloRandom[1];
    }
  });
}

function renderScores() {
  p1Element.textContent = `P1: ${p1Score}`;
  p2Element.innerText = `P2: ${p2Score}`;

  // animateScoreBox();
}

function renderplaceholderText() {
  for (let die of diceElement) {
    die.classList.remove("lock");
    die.textContent = "?";
    if (die.classList.contains("hi-lo")) {
      die.textContent = "⬇️⬆️";
    }
  }
  roundInfo.textContent = "ready?";
}

function calculateScores() {
  let rollHiLo = 0;
  let roundPoints = 0;
  let rollTotal = 0;
  let rollHiLoNumber = 0;
  let finalRoundScore = 0;

  for (let i = 0; i < diceElement.length; i++) {
    if (i <= 4) {
      rollTotal += parseInt(diceElement[i].innerText);
    } else if (i === 5) {
      rollHiLoNumber = parseInt(diceElement[i].innerText);
      rollHiLo = diceElement[i].dataset.hilo;
    }

    for (let j = 0; j < hiTableData.length; j++) {
      if (rollHiLo === "hi" && rollTotal === hiTableData[j].roll) {
        roundPoints = hiTableData[j].points;
      } else if (rollHiLo === "hi" && rollTotal < 22) {
        roundPoints = 1;
      }
    }

    for (let k = 0; k < loTableData.length; k++) {
      if (rollHiLo === "lo" && rollTotal === loTableData[k].roll) {
        roundPoints = loTableData[k].points;
      } else if (rollHiLo === "lo" && rollTotal > 13) {
        roundPoints = 1;
      }
    }

    finalRoundScore = roundPoints * rollHiLoNumber;

    if (isP1Turn) {
      p1Score += finalRoundScore;
    } else {
      p2Score += finalRoundScore;
    }
  }
}

function switchPlayer() {
  if (!gameFinished) {
    isP1Turn = !isP1Turn;
    rollCount = 0;
    lockedCount = 0;
    RollBtnIsClicked = false;

    animateScoreBox();

    renderplaceholderText();

    if (p1Element.classList.contains("active")) {
      p1Element.classList.remove("active");
      p2Element.classList.add("active");
    } else if (p2Element.classList.contains("active")) {
      p2Element.classList.remove("active");
      p1Element.classList.add("active");
    }
  }
}

function animateScoreBox() {
  if (isP1Turn) {
    p1Element.classList.add("grow");
  } else if (!isP1Turn) {
    p2Element.classList.add("grow");
  }

  setTimeout(() => {
    p1Element.classList.remove("grow");
    p2Element.classList.remove("grow");
  }, 1000);
}

function checkWinCondition() {
  if (p1Score >= winningScore) {
    roundInfo.textContent = "player 1 wins!";
    gameFinished = true;
  } else if (p2Score >= winningScore) {
    roundInfo.textContent = "player 2 wins!";
    gameFinished = true;
  }

  if (gameFinished) {
    rollBtn.textContent = "new game";
    rollBtn.addEventListener("click", setInitialState);
  }
}

function setInitialState() {
  p1Score = 0;
  p2Score = 0;
  rollCount = 0;
  renderScores();
  isP1Turn = true;
  gameFinished = false;
  RollBtnIsClicked = false;
  p1Element.classList.add("active");
  p2Element.classList.remove("active");
  roundInfo.textContent = `ready?`;
  renderplaceholderText();
  rollBtn.textContent = "roll";
}

function rollingAnimation() {
  diceElement.forEach((die) => {
    if (!die.classList.contains("lock")) {
      die.classList.add("roll");

      setTimeout(() => {
        die.classList.remove("roll");
      }, 200);
    }
  });
}

function handleLocks() {
  for (let die of diceElement) {
    die.addEventListener("click", () => {
      if (RollBtnIsClicked) {
        die.classList.add("lock");

        lockedCount = document.querySelectorAll(".dice.lock").length;
      }
    });
  }
}

//TODO: showing points received for each round would be cool (maybe the math too?)

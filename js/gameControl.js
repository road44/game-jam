const wynikDisplay = document.querySelector("#wynik > span");
const ruchyDisplay = document.querySelector("#ruchy > span");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

let moves = 0;
let score = 0;

function updateDisplays() {
  wynikDisplay.textContent = score;
  ruchyDisplay.textContent = moves;
}

const originalResetTurn = window.resetTurn;

window.resetTurn = function () {
  moves++;
  const matchedCards = document.querySelectorAll(".card.matched");
  score = matchedCards.length / 2;

  updateDisplays();
  originalResetTurn();
};

window.gameStarted = false;

startBtn.addEventListener("click", () => {
  moves = 0;
  score = 0;
  updateDisplays();

  window.gameStarted = true;

  window.initBoard();

  startBtn.disabled = true;
  resetBtn.disabled = false;
});

resetBtn.addEventListener("click", () => {
  moves = 0;
  score = 0;
  updateDisplays();

  window.gameStarted = true;

  const board = document.getElementById("board");
  board.innerHTML = "";

  window.firstCard = null;
  window.secondCard = null;
  window.lockBoard = false;

  window.initBoard();

  startBtn.disabled = true;
  resetBtn.disabled = false;
});

resetBtn.disabled = true;
updateDisplays();

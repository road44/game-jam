const wynikDisplay = document.querySelector("#wynik > span");
const ruchyDisplay = document.querySelector("#ruchy > span");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

let moves = 0;
let score = 0;
let gameStarted = false;

function updateDisplays() {
  wynikDisplay.textContent = score;
  ruchyDisplay.textContent = moves;
}

const originalResetTurn = window.resetTurn;

window.resetTurn = function () {
  if (!gameStarted) return;

  moves++;
  const matchedCards = document.querySelectorAll(".card.matched");
  score = matchedCards.length / 2;

  updateDisplays();

  originalResetTurn();
};

function resetGame() {
  if (!gameStarted) return;

  moves = 0;
  score = 0;
  updateDisplays();

  location.reload();

  gameStarted = false;
  resetBtn.disabled = true;
  startBtn.disabled = false;
}

startBtn.addEventListener("click", () => {
  gameStarted = true;

  moves = 0;
  score = 0;
  updateDisplays();

  location.reload();

  startBtn.disabled = true;
  resetBtn.disabled = false;
});

resetBtn.disabled = true;
resetBtn.addEventListener("click", resetGame);

updateDisplays();

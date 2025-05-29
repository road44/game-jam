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

	window.gameStarted = false; // blokujemy kliknięcia podczas pokazu kart

	window.initBoard();

	const allCards = document.querySelectorAll(".card");
	allCards.forEach((card) => card.classList.add("revealed"));

	window.lockBoard = true; // blokada ruchów na czas pokazu

	setTimeout(() => {
		allCards.forEach((card) => card.classList.remove("revealed"));

		window.lockBoard = false;
		window.gameStarted = true;
	}, 2000);

	startBtn.disabled = true;
	resetBtn.disabled = false;
});

resetBtn.addEventListener("click", () => {
	moves = 0;
	score = 0;
	updateDisplays();

	const board = document.getElementById("board");
	board.innerHTML = "";

	window.firstCard = null;
	window.secondCard = null;
	window.lockBoard = false;
	window.gameStarted = false;

	startBtn.disabled = false;
	resetBtn.disabled = true;
});

resetBtn.disabled = true;
updateDisplays();

const wynikDisplay = document.querySelector("#wynik > span");
const ruchyDisplay = document.querySelector("#ruchy > span");
const czasDisplay = document.querySelector("#czas > span");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

let moves = 0;
let score = 0;
let timer = null;
let startTime = null;

function updateDisplays() {
	wynikDisplay.textContent = score;
	ruchyDisplay.textContent = moves;
}

function startTimer() {
	startTime = Date.now();
	timer = setInterval(() => {
		const elapsed = Math.floor((Date.now() - startTime) / 1000);
		const minutes = Math.floor(elapsed / 60);
		const seconds = elapsed % 60;
		czasDisplay.textContent = `${minutes}:${seconds
			.toString()
			.padStart(2, "0")}`;
	}, 1000);
}

const winMessage = document.getElementById("win-message");
const restartBtn = document.getElementById("restart");

function showWinMessage() {
	const finalScoreText = `Twój wynik to: ${score}!!`;
	const finalMovesText = `Dokonałeś tego w ${moves} ruchach!`;
	document.getElementById("final-score").textContent = finalScoreText;
	document.getElementById("final-moves").textContent = finalMovesText;

	document.getElementById("win-message").style.display = "block";
	document.getElementById("win-overlay").style.display = "block";
	resetBtn.disabled = true;
}

function hideWinMessage() {
	document.getElementById("win-message").style.display = "none";
	document.getElementById("win-overlay").style.display = "none";
}

restartBtn.addEventListener("click", () => {
	moves = 0;
	score = 0;
	updateDisplays();
	czasDisplay.textContent = "0:00";

	const board = document.getElementById("board");
	board.innerHTML = "";

	window.firstCard = null;
	window.secondCard = null;
	window.lockBoard = false;
	window.gameStarted = true;

	hideWinMessage();
	window.initBoard();
	startTimer();

	startBtn.disabled = true;
	resetBtn.disabled = false;
});

function stopTimer() {
	clearInterval(timer);
	timer = null;
}

const originalResetTurn = window.resetTurn;

window.resetTurn = function () {
	moves++;
	const matchedCards = document.querySelectorAll(".card.matched");
	const allCards = document.querySelectorAll(".card");
	score = matchedCards.length / 2;
	updateDisplays();

	if (matchedCards.length === allCards.length) {
		stopTimer();
		showWinMessage();
	}

	originalResetTurn();
};

window.gameStarted = false;

startBtn.addEventListener("click", () => {
	moves = 0;
	score = 0;
	updateDisplays();
	czasDisplay.textContent = "0:00";

	window.gameStarted = true;

	window.initBoard();
	startTimer();

	startBtn.disabled = true;
	resetBtn.disabled = false;
});

resetBtn.addEventListener("click", () => {
	moves = 0;
	score = 0;
	updateDisplays();
	czasDisplay.textContent = "0:00";

	const board = document.getElementById("board");
	board.innerHTML = "";

	window.firstCard = null;
	window.secondCard = null;
	window.lockBoard = false;
	window.gameStarted = true;

	window.initBoard();
	startTimer();

	startBtn.disabled = true;
	resetBtn.disabled = false;
});

resetBtn.disabled = true;
updateDisplays();
czasDisplay.textContent = "0:00";

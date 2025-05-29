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

// Podmieniamy funkcję resetTurn (jest z board.js)
const originalResetTurn = window.resetTurn;

window.resetTurn = function () {
	moves++;
	const matchedCards = document.querySelectorAll(".card.matched");
	score = matchedCards.length / 2;

	updateDisplays();
	originalResetTurn();
};

// Start gry
startBtn.addEventListener("click", () => {
	moves = 0;
	score = 0;
	updateDisplays();

	// Wywołaj funkcję z board.js, aby rozłożyć karty i rozpocząć grę
	initBoard();

	// Możesz tutaj ustawić dodatkowo jakieś flagi, jeśli chcesz blokować przycisk Start itp.
	startBtn.disabled = true;
	resetBtn.disabled = false;
});

// Reset gry
resetBtn.addEventListener("click", () => {
	moves = 0;
	score = 0;
	updateDisplays();

	// Czyścimy planszę
	board.innerHTML = "";

	// Resetujemy zmienne w board.js
	firstCard = null;
	secondCard = null;
	lockBoard = false;

	// Odblokowujemy start
	startBtn.disabled = false;
	resetBtn.disabled = true;
});

// Na początek reset przycisku reset, bo gra nie ruszyła
resetBtn.disabled = true;
updateDisplays();

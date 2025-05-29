const emojis = ["🍎", "🚗", "🐶", "🎵", "🍕", "⚽", "📚", "🌞", "🎁", "🎲"];
const board = document.getElementById("board");

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

function initBoard() {
	board.innerHTML = "";
	cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
	firstCard = null;
	secondCard = null;
	lockBoard = false;

	cards.forEach((symbol, index) => {
		const card = document.createElement("div");
		card.classList.add("card");
		card.dataset.symbol = symbol;
		card.dataset.index = index;

		const front = document.createElement("div");
		front.classList.add("front");
		front.textContent = "";

		const back = document.createElement("div");
		back.classList.add("back");
		back.textContent = symbol;

		card.appendChild(front);
		card.appendChild(back);

		card.addEventListener("click", () => {
			if (!window.gameStarted) return;
			if (
				lockBoard ||
				card.classList.contains("revealed") ||
				card.classList.contains("matched")
			)
				return;

			card.classList.add("revealed");

			if (!firstCard) {
				firstCard = card;
			} else {
				secondCard = card;
				lockBoard = true;

				if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
					setTimeout(() => {
						firstCard.classList.add("matched");
						secondCard.classList.add("matched");
						resetTurn();
					}, 500);
				} else {
					setTimeout(() => {
						firstCard.classList.remove("revealed");
						secondCard.classList.remove("revealed");
						resetTurn();
					}, 1000);
				}
			}
		});

		board.appendChild(card);
	});
}

function resetTurn() {
	[firstCard, secondCard] = [null, null];
	lockBoard = false;
}

window.initBoard = initBoard;
window.resetTurn = resetTurn;

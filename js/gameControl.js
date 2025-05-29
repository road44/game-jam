class SimpleLogic {
  constructor(emojis) {
    this.emojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    this.cardCount = this.emojis.length;
    this.firstIndex = null;
    this.secondIndex = null;
    this.lockBoard = false;
  }

  revealCard(index) {
    if (this.lockBoard) return { validMove: false };
    if (index === this.firstIndex || index === this.secondIndex) return { validMove: false };

    if (this.firstIndex === null) {
      this.firstIndex = index;
      return { validMove: true, indexes: [index], matched: false };
    } else if (this.secondIndex === null) {
      this.secondIndex = index;
      this.lockBoard = true;

      const matched = this.emojis[this.firstIndex] === this.emojis[this.secondIndex];
      return { validMove: true, indexes: [this.firstIndex, this.secondIndex], matched };
    }
    return { validMove: false };
  }

  reset() {
    this.firstIndex = null;
    this.secondIndex = null;
    this.lockBoard = false;
    this.emojis = [...this.emojis].sort(() => Math.random() - 0.5);
  }

  finishTurn(matched, callback) {
    setTimeout(() => {
      if (!matched) callback(this.firstIndex, this.secondIndex);
      this.firstIndex = null;
      this.secondIndex = null;
      this.lockBoard = false;
    }, 1000);
  }
}

class MemoGameController {
  constructor({ cardElements, scoreElement, movesElement, startButton, restartButton, logic, timerElement }) {
    this.cardElements = cardElements;
    this.scoreElement = scoreElement;
    this.movesElement = movesElement;
    this.startButton = startButton;
    this.restartButton = restartButton;
    this.logic = logic;
    this.timerElement = timerElement;

    this.score = 0;
    this.moves = 0;
    this.timer = null;
    this.timeElapsed = 0;
    this.timerRunning = false;
    this.focusIndex = 0;
    this.gameStarted = false;

    this.bindEvents();
    this.updateScore(0);
    this.updateMoves(0);
    this.updateTimer(0);
    this.updateFocus();
  }

  bindEvents() {
    this.cardElements.forEach((card, index) => {
      card.dataset.index = index;
      card.addEventListener("click", () => this.handleCardClick(index));
    });

    this.startButton.addEventListener("click", () => this.handleStart());
    this.restartButton.addEventListener("click", () => this.handleRestart());

    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  handleStart() {
    if (this.gameStarted) return;
    this.gameStarted = true;
    this.startButton.disabled = true;
    this.restartButton.disabled = false;
  }

  handleKeyDown(e) {
    const maxIndex = this.cardElements.length - 1;
    switch (e.key) {
      case "ArrowRight":
      case "d":
        this.focusIndex = (this.focusIndex + 1) > maxIndex ? 0 : this.focusIndex + 1;
        break;
      case "ArrowLeft":
      case "a":
        this.focusIndex = (this.focusIndex - 1) < 0 ? maxIndex : this.focusIndex - 1;
        break;
      case "ArrowDown":
      case "s":
        this.focusIndex += 4;
        if (this.focusIndex > maxIndex) this.focusIndex %= (maxIndex + 1);
        break;
      case "ArrowUp":
      case "w":
        this.focusIndex -= 4;
        if (this.focusIndex < 0) this.focusIndex += maxIndex + 1;
        break;
      case "Enter":
      case " ":
        this.handleCardClick(this.focusIndex);
        break;
    }
    this.updateFocus();
  }

  updateFocus() {
    this.cardElements.forEach((card, i) => {
      if (i === this.focusIndex) {
        card.classList.add("focused");
        card.focus?.();
      } else {
        card.classList.remove("focused");
      }
    });
  }

  handleCardClick(index) {
    if (!this.gameStarted) return;
    if (!this.timerRunning) this.startTimer();

    const result = this.logic.revealCard(index);
    if (!result.validMove) return;

    this.updateMoves(this.moves + 1);

    result.indexes.forEach(i => {
      const card = this.cardElements[i];
      card.classList.add("revealed");
      card.textContent = this.logic.emojis[i];
    });

    if (result.matched) {
      this.updateScore(this.score + 1);
      result.indexes.forEach(i => this.cardElements[i].classList.add("matched"));
      this.logic.finishTurn(true);
    } else {
      this.logic.finishTurn(false, (i1, i2) => {
        this.cardElements[i1].classList.remove("revealed");
        this.cardElements[i2].classList.remove("revealed");
        this.cardElements[i1].textContent = "";
        this.cardElements[i2].textContent = "";
      });
    }

    if (this.score === this.logic.cardCount / 2) {
      this.stopTimer();
      this.startButton.disabled = false;
    }
  }

  updateScore(score) {
    this.score = score;
    if (this.scoreElement) {
      this.scoreElement.innerHTML = `<span>${score}</span>`;
    }
  }

  updateMoves(moves) {
    this.moves = moves;
    if (this.movesElement) {
      this.movesElement.innerHTML = `<span>${moves}</span>`;
    }
  }

  updateTimer(seconds) {
    this.timeElapsed = seconds;
    if (this.timerElement) {
      const m = Math.floor(seconds / 60).toString().padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      this.timerElement.textContent = `${m}:${s}`;
    }
  }

  startTimer() {
    this.timerRunning = true;
    this.timer = setInterval(() => {
      this.updateTimer(this.timeElapsed + 1);
    }, 1000);
  }

  stopTimer() {
    this.timerRunning = false;
    clearInterval(this.timer);
    this.timer = null;
  }

  handleRestart() {
    if (!this.gameStarted) return;

    this.logic.reset();
    this.updateScore(0);
    this.updateMoves(0);
    this.updateTimer(0);
    this.stopTimer();

    this.cardElements.forEach(card => {
      card.classList.remove("revealed", "matched");
      card.textContent = "";
    });
    this.focusIndex = 0;
    this.updateFocus();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const emojis = ["🍎", "🚗", "🐶", "🎵", "🍕", "⚽", "📚", "🌞", "🎁", "🎲"];
  const cardElements = document.querySelectorAll(".memo-card");
  const scoreElement = document.getElementById("wynik");
  const movesElement = document.getElementById("ruchy");
  const startButton = document.getElementById("start");
  const restartButton = document.getElementById("reset");
  const timerElement = null; // Dodaj jak masz <div id="timer"></div>

  restartButton.disabled = true;

  const logic = new SimpleLogic(emojis);

  new MemoGameController({
    cardElements,
    scoreElement,
    movesElement,
    startButton,
    restartButton,
    logic,
    timerElement,
  });
});

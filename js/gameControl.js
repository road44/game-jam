class MemoGameController {
  constructor({ cardElements, scoreElement, restartButton, logic, timerElement }) {
    this.cardElements = cardElements;
    this.scoreElement = scoreElement;
    this.restartButton = restartButton;
    this.logic = logic;
    this.timerElement = timerElement;

    this.score = 0;
    this.timer = null;
    this.timeElapsed = 0;
    this.timerRunning = false;

    this.focusIndex = 0;

    this.bindEvents();
    this.updateScore(0);
    this.updateTimer(0);
    this.updateFocus();
  }

  bindEvents() {
    this.cardElements.forEach((card, index) => {
      card.dataset.index = index;
      card.addEventListener("click", () => this.handleCardClick(index));
    });

    this.restartButton.addEventListener("click", () => this.handleRestart());

    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    const maxIndex = this.cardElements.length - 1;
    switch (e.key) {
      case "ArrowRight":
      case "d":
      case "D":
        this.focusIndex = (this.focusIndex + 1) > maxIndex ? 0 : this.focusIndex + 1;
        this.updateFocus();
        e.preventDefault();
        break;

      case "ArrowLeft":
      case "a":
      case "A":
        this.focusIndex = (this.focusIndex - 1) < 0 ? maxIndex : this.focusIndex - 1;
        this.updateFocus();
        e.preventDefault();
        break;

      case "ArrowDown":
      case "s":
      case "S":
        this.focusIndex += 4;
        if (this.focusIndex > maxIndex) this.focusIndex %= (maxIndex + 1);
        this.updateFocus();
        e.preventDefault();
        break;

      case "ArrowUp":
      case "w":
      case "W":
        this.focusIndex -= 4;
        if (this.focusIndex < 0) this.focusIndex += maxIndex + 1;
        this.updateFocus();
        e.preventDefault();
        break;

      case "Enter":
      case " ":
        this.handleCardClick(this.focusIndex);
        e.preventDefault();
        break;
    }
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
    if (!this.timerRunning) {
      this.startTimer();
    }
    const result = this.logic.revealCard(index);
    if (!result.validMove) return;

    result.indexes.forEach(i => {
      this.cardElements[i].classList.add("revealed");
    });

    if (result.matched) {
      this.updateScore(this.score + 1);
      result.indexes.forEach(i => {
        this.cardElements[i].classList.add("matched");
      });
    }

    if (this.score === this.logic.cardCount / 2) {
      this.stopTimer();
    }
  }

  updateUIAfterCheck(result) {
    if (!result.matched) {
      result.indexes.forEach(i => {
        this.cardElements[i].classList.remove("revealed");
      });
    }
  }

  updateScore(score) {
    this.score = score;
    if (this.scoreElement) {
      this.scoreElement.textContent = `Wynik: ${score}`;
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
    if (this.timerRunning) return;
    this.timerRunning = true;
    this.timer = setInterval(() => {
      this.updateTimer(this.timeElapsed + 1);
    }, 1000);
  }

  stopTimer() {
    this.timerRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  handleRestart() {
    this.logic.reset();
    this.updateScore(0);
    this.updateTimer(0);
    this.stopTimer();

    this.cardElements.forEach(card => {
      card.classList.remove("revealed", "matched");
    });
    this.focusIndex = 0;
    this.updateFocus();
  }
}

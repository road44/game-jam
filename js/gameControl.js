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

        this.bindEvents();
        this.updateScore(0)
        this.updateTimer(0);
    }
    bindEvents() {
        this.cardElements.forEach((card, index) => {
            card.dataset.index = index;
            card.addEventListener("click", () => this.handleCardClick(index));
        });
        
        this.restartButton.addEventListener("click", () => this.handleRestart());
    }
}
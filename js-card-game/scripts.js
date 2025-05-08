const animals = [
    'jellyfish.png', 'cow.png', 'koala.png', 'sheep.png',
    'zebra.png', 'panda.png', 'tiger.png', 'bear.png'
];

let cardsArray = [...animals, ...animals];
let gameBoard = document.getElementById('game-board');
let scoreElement = document.getElementById('score');
let moveCounterElement = document.getElementById('moves');
let timerElement = document.getElementById('timer');
let resetButton = document.getElementById('restart-btn');
let flippedCards = [];
let score = 0;
let moves = 0;
let matchedPairs = 0;
let gameStarted = false;
let timerInterval;
let timeElapsed = 0;
let currentLanguage = 'tr';

const languageData = {
    tr: {
        title: "Hayvan Hafıza Oyunu",
        score: "Skor",
        moves: "Hamle",
        time: "Süre",
        winMessage: (m, t) => `Tebrikler! ${m} hamlede ve ${t} saniyede kazandınız.`,
        restart: "Oyunu Yeniden Başlat"
    },
    en: {
        title: "Zoo Memory Game",
        score: "Score",
        moves: "Moves",
        time: "Time",
        winMessage: (m, t) => `Congratulations! You won in ${m} moves and ${t} seconds.`,
        restart: "Restart Game"
    }
};

function updateTexts() {
    document.getElementById('game-title').innerText = languageData[currentLanguage].title;
    scoreElement.innerText = `${score}`;
    document.getElementById('score-label').firstChild.textContent = `${languageData[currentLanguage].score}: `;
    moveCounterElement.innerText = `${languageData[currentLanguage].moves}: ${moves}`;
    timerElement.innerText = `${languageData[currentLanguage].time}: ${timeElapsed}s`;
    resetButton.innerText = languageData[currentLanguage].restart;
}

function createCards() {
    gameBoard.innerHTML = '';
    cardsArray = [...animals, ...animals].sort(() => Math.random() - 0.5);
    cardsArray.forEach(animal => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.animal = animal;

        const img = document.createElement('img');
        img.src = `images/${animal}`;

        card.appendChild(img);
        gameBoard.appendChild(card);

        card.addEventListener('click', flipCard);
    });
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerElement.innerText = `${languageData[currentLanguage].time}: ${timeElapsed}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function flipCard() {
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            moveCounterElement.innerText = `${languageData[currentLanguage].moves}: ${moves}`;
            setTimeout(checkMatch, 800);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.animal === card2.dataset.animal) {
        score += 10;
        matchedPairs++;
        scoreElement.innerText = `${score}`;
        flippedCards = [];

        if (matchedPairs === animals.length) {
            stopTimer();
            setTimeout(() => {
                alert(languageData[currentLanguage].winMessage(moves, timeElapsed));
                resetButton.style.display = 'block';
            }, 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
    }
}

function resetGame() {
    flippedCards = [];
    score = 0;
    moves = 0;
    matchedPairs = 0;
    timeElapsed = 0;
    gameStarted = false;
    stopTimer();
    updateTexts();
    resetButton.style.display = 'none';
    createCards();
}

document.getElementById('lang-tr').addEventListener('click', () => {
    currentLanguage = 'tr';
    updateTexts();
});

document.getElementById('lang-en').addEventListener('click', () => {
    currentLanguage = 'en';
    updateTexts();
});

resetButton.addEventListener('click', resetGame);

updateTexts();
createCards();
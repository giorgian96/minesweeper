// Interfaces
interface Cell {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
    element: HTMLElement;
}

interface DifficultySetting {
    name: string;
    size: {
        width: number;
        height: number;
    };
    numberOfMines: number;
    tileSize: string;
}

interface GameState {
    board: Cell[][];
    difficulty: DifficultySetting;
    minesRemaining: number;
    timer: number;
    gameOver: boolean;
}

// Variables & DOM selections
const DIFFICULTIES: Record<string, DifficultySetting> = {
    easy:   { name: 'Easy',   size: { width: 9,  height: 9  }, numberOfMines: 10, tileSize: '38px' },
    medium: { name: 'Medium', size: { width: 16, height: 16 }, numberOfMines: 40, tileSize: '28px' },
    hard:   { name: 'Hard',   size: { width: 30, height: 16 }, numberOfMines: 99, tileSize: '28px' },
};

const difficultySelect = document.getElementById('difficulty') as HTMLSelectElement;
const gameBoard = document.getElementById('game-board') as HTMLDivElement;

const scoreDisplay = document.getElementById('score') as HTMLDivElement;
const timerDisplay = document.getElementById('timer') as HTMLDivElement;

// Game logic, functions, event listeners
Object.entries(DIFFICULTIES).forEach(function ([key, setting]) {
    // populate the select with our difficulties
    const option = document.createElement('option');
    option.value = key;
    option.textContent = setting.name;
    difficultySelect.appendChild(option);
});

function initGame(difficulty: DifficultySetting): void {
    // Clear the board
    gameBoard.innerHTML = '';

    // Set --cols and --rows CSS variables on the board element, also set --tile-size
    gameBoard.style.setProperty('--cols', difficulty.size.width.toString());
    gameBoard.style.setProperty('--rows', difficulty.size.height.toString());
    gameBoard.style.setProperty('--tile-size', difficulty.tileSize);

    // Set timer and score displays
    scoreDisplay.textContent = difficulty.numberOfMines.toString();
    timerDisplay.textContent = '00:00';

    // Loop width * height times, create a tile div, append it
    const totalTiles = difficulty.size.width * difficulty.size.height;
    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        gameBoard.appendChild(tile);
    }
}

difficultySelect.addEventListener('change', function() {
    // get the selected value, look it up in DIFFICULTIES, call initGame
    const selected = DIFFICULTIES[difficultySelect.value];
    if (selected) {
        initGame(selected);
    }
});

function revealTile(target: HTMLElement): void {
    console.log('reveal!');
}

gameBoard.addEventListener('click', function(event) {
    // left click - reveal tile
    // first prevent click on flagged or revealed or non tiles
    const target = event.target as HTMLElement;
    if (!target.classList.contains('tile')) return;
    if (target.classList.contains('revealed')) return;
    if (target.classList.contains('flagged')) return;

    revealTile(target);
});

gameBoard.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // stops the browser context menu from appearing
    // right click - flag tile
    const target = event.target as HTMLElement;
    if (!target.classList.contains('tile')) return;
    if (target.classList.contains('revealed')) return;
    target.classList.toggle('flagged');
});

// Initialization
const initialDifficulty = DIFFICULTIES['easy'];
if (initialDifficulty) {
    initGame(initialDifficulty);
}
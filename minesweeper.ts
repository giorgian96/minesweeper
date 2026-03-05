// Interfaces
interface DifficultySetting {
    name: string;
    size: {
        width: number;
        height: number;
    };
    numberOfMines: number;
    tileSize: string;
}

// Variables & DOM selections
const DIFFICULTIES: Record<string, DifficultySetting> = {
    easy:   { name: 'Easy',   size: { width: 9,  height: 9  }, numberOfMines: 10, tileSize: '38px' },
    medium: { name: 'Medium', size: { width: 16, height: 16 }, numberOfMines: 40, tileSize: '28px' },
    hard:   { name: 'Hard',   size: { width: 30, height: 16 }, numberOfMines: 99, tileSize: '28px' },
};

const difficultySelect = document.getElementById('difficulty') as HTMLSelectElement;
const gameBoardDiv = document.getElementById('game-board') as HTMLDivElement;

// Game logic, functions, event listeners
Object.entries(DIFFICULTIES).forEach(function ([key, setting]) {
    // populate the select with our difficulties
    const option = document.createElement('option');
    option.value = key;
    option.textContent = setting.name;
    difficultySelect.appendChild(option);
});

function initGame(difficulty: DifficultySetting): void {
    // 1. Clear the board
    gameBoardDiv.innerHTML = '';

    // 2. Set --cols and --rows CSS variables on the board element, also set --tile-size
    gameBoardDiv.style.setProperty('--cols', difficulty.size.width.toString());
    gameBoardDiv.style.setProperty('--rows', difficulty.size.height.toString());
    gameBoardDiv.style.setProperty('--tile-size', difficulty.tileSize);

    // 3. Loop width * height times, create a tile div, append it
    const totalTiles = difficulty.size.width * difficulty.size.height;
    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        gameBoardDiv.appendChild(tile);
    }
}

difficultySelect.addEventListener('change', function() {
    // get the selected value, look it up in DIFFICULTIES, call initGame
    const selected = DIFFICULTIES[difficultySelect.value];
    if (selected) {
        initGame(selected);
    }
});

// Initialization
const initialDifficulty = DIFFICULTIES['easy'];
if (initialDifficulty) {
    initGame(initialDifficulty);
}
// Interfaces and enums
var GameStatus;
(function (GameStatus) {
    GameStatus["Waiting"] = "waiting";
    GameStatus["Playing"] = "playing";
    GameStatus["Won"] = "won";
    GameStatus["Lost"] = "lost";
})(GameStatus || (GameStatus = {}));
// Variables & DOM selections
const DIFFICULTIES = {
    easy: { name: 'Easy', size: { width: 9, height: 9 }, numberOfMines: 10, tileSize: '38px' },
    medium: { name: 'Medium', size: { width: 16, height: 16 }, numberOfMines: 40, tileSize: '28px' },
    hard: { name: 'Hard', size: { width: 30, height: 16 }, numberOfMines: 99, tileSize: '28px' },
};
const STATUS_TEXTS = {
    [GameStatus.Waiting]: "Be careful! Your first click could be a mine 🥶",
    [GameStatus.Playing]: "I can't look! 🫣",
    [GameStatus.Lost]: "Oh no! You've lost... 😓",
    [GameStatus.Won]: "Yes! You've won! 😅"
};
let timerInterval = null;
let gameState;
const difficultySelect = document.getElementById('difficulty');
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const newGameBtn = document.getElementById('new-game');
const statusText = document.getElementById('status-text');
// Game logic, functions, event listeners
function updateStatusText() {
    if (!gameState)
        return;
    const newStatus = STATUS_TEXTS[gameState.status];
    if (!newStatus)
        return;
    statusText.textContent = newStatus;
}
function updateGameStatus(newStatus) {
    if (!gameState)
        return;
    gameState.status = newStatus;
    updateStatusText();
    if (newStatus === GameStatus.Playing) {
        startTimer();
    }
    if (newStatus === GameStatus.Won || newStatus === GameStatus.Lost) {
        stopTimer();
    }
}
Object.entries(DIFFICULTIES).forEach(function ([key, setting]) {
    // populate the select with our difficulties
    const option = document.createElement('option');
    option.value = key;
    option.textContent = setting.name;
    difficultySelect.appendChild(option);
});
function initGame(difficulty) {
    stopTimer(); // Clear the timer
    gameBoard.innerHTML = ''; // Clear the board
    // Set --cols and --rows CSS variables on the board element, also set --tile-size
    gameBoard.style.setProperty('--cols', difficulty.size.width.toString());
    gameBoard.style.setProperty('--rows', difficulty.size.height.toString());
    gameBoard.style.setProperty('--tile-size', difficulty.tileSize);
    // Set timer and score displays
    scoreDisplay.textContent = difficulty.numberOfMines.toString();
    timerDisplay.textContent = '00:00';
    // Loop width * height times, create a tile div, append it
    let theBoard = [];
    for (let row = 0; row < difficulty.size.height; row++) {
        let theRow = [];
        for (let col = 0; col < difficulty.size.width; col++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.row = row.toString();
            tile.dataset.col = col.toString();
            gameBoard.appendChild(tile);
            theRow.push({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
                element: tile
            });
        }
        theBoard.push(theRow);
    }
    // Set the game state
    gameState = {
        board: theBoard,
        difficulty: difficulty,
        minesRemaining: difficulty.numberOfMines,
        timer: 0,
        status: GameStatus.Waiting
    };
    updateStatusText();
    placeMines();
    calculateAdjacentMines();
}
function placeMines() {
    if (!gameState)
        return;
    let minesToPlace = gameState.minesRemaining;
    while (minesToPlace > 0) {
        const randomRow = Math.floor(Math.random() * gameState.board.length);
        const randomCol = Math.floor(Math.random() * gameState.board[randomRow].length);
        const cell = gameState.board[randomRow][randomCol];
        if (cell.isMine)
            continue;
        cell.isMine = true;
        minesToPlace--;
    }
}
function calculateAdjacentMines() {
    if (!gameState)
        return;
    const offsets = [-1, 0, 1];
    for (let row = 0; row < gameState.board.length; row++) {
        const tilesOfRow = gameState.board[row];
        for (let col = 0; col < tilesOfRow.length; col++) {
            const cell = tilesOfRow[col];
            if (cell.isMine)
                continue;
            let mineCount = 0;
            // check all the neighbors of the cell for mines
            for (const rowOffset of offsets) {
                for (const colOffset of offsets) {
                    if (rowOffset === 0 && colOffset === 0)
                        continue; // both offsets 0 so this is our cell
                    const neighborCell = gameState.board[row + rowOffset]?.[col + colOffset];
                    if (!neighborCell)
                        continue; // not within bounds
                    if (neighborCell.isMine)
                        mineCount++;
                }
            }
            cell.adjacentMines = mineCount;
        }
    }
}
function restartGame() {
    // get the selected value, look it up in DIFFICULTIES, call initGame
    const selected = DIFFICULTIES[difficultySelect.value];
    if (selected) {
        initGame(selected);
    }
}
difficultySelect.addEventListener('change', restartGame);
function revealTile(cell) {
    if (cell.isRevealed || cell.isFlagged)
        return;
    cell.isRevealed = true;
    cell.element.classList.add('revealed');
    if (cell.isMine) {
        cell.element.classList.add('mine');
        // game is over, we lost
        updateGameStatus(GameStatus.Lost);
        return;
    }
    if (cell.adjacentMines > 0) {
        cell.element.dataset.count = cell.adjacentMines.toString();
        cell.element.textContent = cell.adjacentMines.toString();
        return;
    }
    // empty cell — recursively reveal neighbors
    const offsets = [-1, 0, 1];
    for (const rowOffset of offsets) {
        for (const colOffset of offsets) {
            if (rowOffset === 0 && colOffset === 0)
                continue; // both offsets 0 so this is our cell
            const row = parseInt(cell.element.dataset.row);
            const col = parseInt(cell.element.dataset.col);
            const neighbor = gameState?.board[row + rowOffset]?.[col + colOffset];
            if (!neighbor)
                continue;
            revealTile(neighbor);
        }
    }
}
gameBoard.addEventListener('click', function (event) {
    // left click - reveal tile
    // check if game is already over
    if (gameState?.status === GameStatus.Won || gameState?.status === GameStatus.Lost)
        return;
    // prevent click on flagged or revealed or non tiles
    const target = event.target;
    if (!target.classList.contains('tile'))
        return;
    if (target.classList.contains('revealed'))
        return;
    if (target.classList.contains('flagged'))
        return;
    // check if game is just now starting
    if (gameState?.status === GameStatus.Waiting) {
        updateGameStatus(GameStatus.Playing);
    }
    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);
    const cell = gameState?.board[row]?.[col];
    if (!cell)
        return;
    revealTile(cell);
});
gameBoard.addEventListener('contextmenu', function (event) {
    // right click - flag tile
    event.preventDefault(); // stops the browser context menu from appearing
    // check if game is already over
    if (gameState?.status === GameStatus.Won || gameState?.status === GameStatus.Lost)
        return;
    const target = event.target;
    if (!target.classList.contains('tile'))
        return;
    if (target.classList.contains('revealed'))
        return;
    target.classList.toggle('flagged');
    // check if game is just now starting
    if (gameState?.status === GameStatus.Waiting) {
        updateGameStatus(GameStatus.Playing);
    }
});
newGameBtn.addEventListener('click', restartGame);
function startTimer() {
    timerInterval = setInterval(function () {
        if (!gameState)
            return;
        gameState.timer++;
        updateTimerDisplay();
    }, 1000);
}
function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}
function updateTimerDisplay() {
    if (!gameState)
        return;
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formatted;
}
// Initialization
const initialDifficulty = DIFFICULTIES['easy'];
if (initialDifficulty) {
    initGame(initialDifficulty);
}
export {};
//# sourceMappingURL=minesweeper.js.map
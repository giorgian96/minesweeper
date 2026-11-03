declare enum GameStatus {
    Waiting = "waiting",
    Playing = "playing",
    Won = "won",
    Lost = "lost"
}
interface Cell {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
    element: HTMLDivElement;
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
    status: GameStatus;
}
declare const DIFFICULTIES: Record<string, DifficultySetting>;
declare const STATUS_TEXTS: Record<GameStatus, string>;
declare const soundCache: Map<string, HTMLAudioElement>;
declare let timerInterval: number | null;
declare let gameState: GameState | null;
declare const difficultySelect: HTMLSelectElement;
declare const gameBoard: HTMLDivElement;
declare const scoreDisplay: HTMLDivElement;
declare const timerDisplay: HTMLDivElement;
declare const newGameBtn: HTMLButtonElement;
declare const statusText: HTMLParagraphElement;
declare function updateStatusText(): void;
declare function updateGameStatus(newStatus: GameStatus): void;
declare function initGame(difficulty: DifficultySetting): void;
declare function placeMines(): void;
declare function calculateAdjacentMines(): void;
declare function restartGame(): void;
declare function revealTile(cell: Cell): void;
declare function startTimer(): void;
declare function stopTimer(): void;
declare function updateTimerDisplay(): void;
declare function updateScoreDisplay(): void;
declare function checkWin(): void;
declare function playSound(soundName: string): void;
declare const initialDifficulty: DifficultySetting | undefined;
//# sourceMappingURL=minesweeper.d.ts.map
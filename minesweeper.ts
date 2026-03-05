// Interfaces
interface DifficultySetting {
    name: string;
    size: {
        width: number;
        height: number;
    };
    numberOfMines: number;
}

// Variables & DOM selections
const DIFFICULTIES: Record<string, DifficultySetting> = {
    easy:   { name: 'Easy',   size: { width: 9,  height: 9  }, numberOfMines: 10 },
    medium: { name: 'Medium', size: { width: 16, height: 16 }, numberOfMines: 40 },
    hard:   { name: 'Hard',   size: { width: 30, height: 16 }, numberOfMines: 99 },
};

const difficultySelect = document.getElementById('difficulty') as HTMLSelectElement;

// Game logic, functions, event listeners
Object.entries(DIFFICULTIES).forEach(function ([key, setting]) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = setting.name;
    difficultySelect.appendChild(option);
});

// Initialization
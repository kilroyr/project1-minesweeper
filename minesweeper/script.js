const gameContainer = document.getElementById('game-container');

const gridSize = 5;
const totalMines = 3; 
let mineLocations = [];
let revealedTiles = 0;

function initializeGame() {
    generateMines();
    renderGrid();

}

function generateMines() {
    for (let i = 0; i < totalMines; i++) {
        let minePosition;
        do {
            minePosition = Math.floor(Math.random() * gridSize * gridSize);
        } while (mineLocations.includes(minePosition));
        mineLocations.push(minePosition);
    }
}

function renderGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = i;

        tile.addEventListener('click', () => handleTileClick(i));
        tile.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            handleRightClick(i);
        });

        gameContainer.appendChild(tile);
    }
}

function handleTileClick(index) {
    if (mineLocations.includes(index)) {
        endGame(false);
    } else {
        revealTile(index);
    }
}

function handleRightClick(index) {
    const tile = document.querySelector(`.tile[data-index="${index}"]`);

    if (!tile.classList.contains('opened')) {
        tile.classList.toggle('flagged');
    }
}

function revealTile(index) {
    const tile = document.querySelector(`.tile[data-index="${index}"]`);

    if (!tile.classList.contains('opened') && !tile.classList.contains('flagged')) {
        tile.classList.add('opened');
        revealedTiles++;

        if (revealedTiles === gridSize * gridSize - totalMines) {
            endGame(true);
        }
    }
}

function endGame(isWinner) {
  

    if (isWinner) {
        alert(`Congratulations! You won in ${timeTaken} seconds.`);
    } else {
        alert(`Sorry, you hit a mine! Game over.`);
    }

    gameContainer.innerHTML = '';
    mineLocations = [];
    revealedTiles = 0;
    initializeGame();
}

initializeGame();

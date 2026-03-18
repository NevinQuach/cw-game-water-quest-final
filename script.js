// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timerInterval;          // Holds the interval for timer countdown

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}



// Score System
const score = document.getElementById('current-cans');

document.querySelector('.game-grid').addEventListener('click', function(event) {
  if (!event.target.classList.contains('water-can')) return;
  currentScore += 1;
  score.textContent = currentScore;

  let cangoal = 20;
  if (currentScore >= cangoal) {
    endGame();
  }

});

// Initializes and starts a new game
function startGame() {

  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;

  timeLeft = 30;
  timer.textContent = timeLeft;
  currentScore = 0;
  score.textContent = currentScore;

  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timer.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
    
  }, 1000);

}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop timer countdown
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
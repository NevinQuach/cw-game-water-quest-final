// ===== Game Settings =====
const DIFFICULTY_SETTINGS = {
  easy: {
    goalCans: 15,
    startTimeSeconds: 30,
    spawnRateMs: 1250,
  },
  medium: {
    goalCans: 20,
    startTimeSeconds: 25,
    spawnRateMs: 1000,
  },
  hard: {
    goalCans: 25,
    startTimeSeconds: 20,
    spawnRateMs: 750,
  },
};

// ===== Cached DOM Elements =====
const grid = document.querySelector('.game-grid');
const scoreEl = document.getElementById('current-cans');
const timerEl = document.getElementById('timer');
const endMessageHolderEl = document.querySelector('.endgamemessageholder');
const endMessageEl = document.getElementById('endgamemessage');
const startButton = document.getElementById('start-game');
const difficultySelect = document.getElementById('difficulty');
const instructionsEl = document.querySelector('.game-instructions');

// ===== Game State =====
let isGameRunning = false;
let score = 0;
let selectedDifficulty = difficultySelect?.value || 'medium';
let currentGoalCans = DIFFICULTY_SETTINGS[selectedDifficulty].goalCans;
let timeLeft = DIFFICULTY_SETTINGS[selectedDifficulty].startTimeSeconds;
let currentSpawnRateMs = DIFFICULTY_SETTINGS[selectedDifficulty].spawnRateMs;
let spawnIntervalId;
let timerIntervalId;

function applyDifficultySettings() {
  selectedDifficulty = difficultySelect?.value || 'medium';
  const settings = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.medium;

  currentGoalCans = settings.goalCans;
  timeLeft = settings.startTimeSeconds;
  currentSpawnRateMs = settings.spawnRateMs;

  if (instructionsEl) {
    instructionsEl.textContent = `Collect ${currentGoalCans} items to complete the game!`;
  }
}

// Build a clean 3x3 grid.
function createGrid() {
  grid.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

// Keep score and timer updates in one place.
function updateStatsUI() {
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
}

function hideEndMessage() {
  endMessageEl.textContent = '';
  endMessageHolderEl.style.display = 'none';
}

function showEndMessage(didWin) {
  endMessageEl.textContent = didWin
    ? 'You win! Great Job Collecting The Cans!'
    : 'You lose! Better Luck Next Time!';

  endMessageHolderEl.style.display = 'flex';
}

// Animate can removal and then remove from the DOM.
function fadeOutWaterCan(waterCanElement) {
  if (!waterCanElement || waterCanElement.classList.contains('fade-out')) return;

  waterCanElement.classList.add('fade-out');

  setTimeout(() => {
    const wrapper = waterCanElement.closest('.water-can-wrapper');
    if (wrapper) {
      wrapper.remove();
      return;
    }

    waterCanElement.remove();
  }, 250);
}

function clearAllWaterCans() {
  const waterCans = document.querySelectorAll('.water-can');
  waterCans.forEach(fadeOutWaterCan);
}

function spawnWaterCan() {
  if (!isGameRunning) return;

  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach((cell) => {
    cell.innerHTML = '';
  });

  const randomIndex = Math.floor(Math.random() * cells.length);
  const randomCell = cells[randomIndex];

  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

function endGame(didWin) {
  isGameRunning = false;
  clearInterval(spawnIntervalId);
  clearInterval(timerIntervalId);

  showEndMessage(didWin);
  clearAllWaterCans();
}

function onGridClick(event) {
  if (!isGameRunning) return;
  if (!event.target.classList.contains('water-can')) return;

  fadeOutWaterCan(event.target);
  score += 1;
  updateStatsUI();

  if (score >= currentGoalCans) {
    endGame(true);
  }
}

function startTimer() {
  timerIntervalId = setInterval(() => {
    timeLeft -= 1;
    updateStatsUI();

    if (timeLeft <= 0) {
      endGame(score >= currentGoalCans);
    }
  }, 1000);
}

function startGame() {
  if (isGameRunning) return;

  applyDifficultySettings();
  isGameRunning = true;
  score = 0;

  hideEndMessage();
  updateStatsUI();
  createGrid();

  spawnWaterCan();
  spawnIntervalId = setInterval(spawnWaterCan, currentSpawnRateMs);
  startTimer();
}

// Initial setup.
applyDifficultySettings();
createGrid();
updateStatsUI();

grid.addEventListener('click', onGridClick);
startButton.addEventListener('click', startGame);
difficultySelect.addEventListener('change', () => {
  if (isGameRunning) return;
  applyDifficultySettings();
  updateStatsUI();
});
// Memory Match Game Logic

const symbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎲', '🎰'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timerInterval;
let seconds = 0;
let gameStarted = false;

// Initialize game
function initMemoryGame() {
  loadMemoryBestScore();
  createBoard();
}

// Create game board
function createBoard() {
  const board = document.getElementById('memoryBoard');
  board.innerHTML = '';
  
  // Create pairs
  cards = [...symbols, ...symbols];
  cards = shuffleArray(cards);
  
  cards.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = index;
    card.dataset.symbol = symbol;
    
    card.innerHTML = `
      <div class="card-back"></div>
      <div class="card-front">${symbol}</div>
    `;
    
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });
  
  resetStats();
}

// Shuffle array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Flip card
function flipCard(card) {
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }
  
  if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }
  
  card.classList.add('flipped');
  flippedCards.push(card);
  
  if (flippedCards.length === 2) {
    moves++;
    updateMoves();
    checkMatch();
  }
}

// Check for match
function checkMatch() {
  const [card1, card2] = flippedCards;
  const symbol1 = card1.dataset.symbol;
  const symbol2 = card2.dataset.symbol;
  
  if (symbol1 === symbol2) {
    // Match found
    setTimeout(() => {
      card1.classList.add('matched');
      card2.classList.add('matched');
      flippedCards = [];
      matchedPairs++;
      updateMatches();
      
      if (matchedPairs === symbols.length) {
        gameWon();
      }
    }, 500);
  } else {
    // No match
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

// Update moves counter
function updateMoves() {
  document.getElementById('moveCount').textContent = moves;
}

// Update matches counter
function updateMatches() {
  document.getElementById('matchCount').textContent = matchedPairs;
}

// Start timer
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

// Update timer display
function updateTimer() {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById('memoryTimer').textContent = 
    `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Game won
function gameWon() {
  clearInterval(timerInterval);
  
  const message = document.getElementById('memoryMessage');
  message.textContent = `🎉 You won in ${moves} moves and ${seconds} seconds!`;
  
  // Update best score
  const currentBest = Storage.scores.get('memory');
  if (currentBest === 0 || moves < currentBest) {
    Storage.scores.set('memory', moves);
    document.getElementById('bestMoves').textContent = moves;
    message.textContent += ' 🏆 New Best!';
  }
  
  Storage.player.updateStats(true);
  Utils.notify('Congratulations! 🎉', 'success');
}

// Load best score
function loadMemoryBestScore() {
  const best = Storage.scores.get('memory');
  document.getElementById('bestMoves').textContent = best > 0 ? best : '-';
}

// Reset stats
function resetStats() {
  moves = 0;
  matchedPairs = 0;
  seconds = 0;
  flippedCards = [];
  gameStarted = false;
  
  updateMoves();
  updateMatches();
  updateTimer();
  
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  document.getElementById('memoryMessage').textContent = '';
}

// Reset game
function resetMemoryGame() {
  resetStats();
  createBoard();
  Utils.notify('New game started!', 'info');
}

// Cleanup
window.addEventListener('beforeunload', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMemoryGame);
} else {
  initMemoryGame();
}

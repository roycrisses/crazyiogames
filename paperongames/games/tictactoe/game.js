// Tic Tac Toe Game Logic

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerScore = 0;
let aiScore = 0;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]              // Diagonals
];

// Initialize game
function initTicTacToe() {
  const cells = document.querySelectorAll('.ttt-cell');
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });
  
  loadTicTacToeScores();
  updateDisplay();
}

// Handle cell click
function handleCellClick(e) {
  const index = e.target.dataset.index;
  
  if (board[index] !== '' || !gameActive || currentPlayer !== 'X') {
    return;
  }
  
  makeMove(index, 'X');
  
  if (gameActive) {
    setTimeout(() => {
      aiMove();
    }, 500);
  }
}

// Make a move
function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelector(`[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add('taken');
  
  checkResult();
  
  if (gameActive) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }
}

// AI Move (Simple AI)
function aiMove() {
  if (!gameActive) return;
  
  // Try to win
  let move = findWinningMove('O');
  
  // Block player from winning
  if (move === -1) {
    move = findWinningMove('X');
  }
  
  // Take center if available
  if (move === -1 && board[4] === '') {
    move = 4;
  }
  
  // Take a corner
  if (move === -1) {
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === '');
    if (availableCorners.length > 0) {
      move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
  }
  
  // Take any available spot
  if (move === -1) {
    const available = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    move = available[Math.floor(Math.random() * available.length)];
  }
  
  if (move !== -1) {
    makeMove(move, 'O');
  }
}

// Find winning move
function findWinningMove(player) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    const values = [board[a], board[b], board[c]];
    
    if (values.filter(v => v === player).length === 2 && values.includes('')) {
      return pattern[values.indexOf('')];
    }
  }
  return -1;
}

// Check game result
function checkResult() {
  let winner = null;
  
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
      highlightWinner(pattern);
      break;
    }
  }
  
  if (winner) {
    gameActive = false;
    if (winner === 'X') {
      playerScore++;
      updateStatus('🎉 You won!');
      Storage.player.updateStats(true);
    } else {
      aiScore++;
      updateStatus('😔 AI won!');
      Storage.player.updateStats(false);
    }
    updateScores();
  } else if (!board.includes('')) {
    gameActive = false;
    updateStatus("🤝 It's a draw!");
  }
}

// Highlight winning cells
function highlightWinner(pattern) {
  pattern.forEach(index => {
    document.querySelector(`[data-index="${index}"]`).classList.add('winner');
  });
}

// Update status message
function updateStatus(message) {
  const status = document.getElementById('gameStatus');
  if (message) {
    status.textContent = message;
  } else {
    status.textContent = currentPlayer === 'X' ? 'Your turn! (X)' : 'AI thinking... (O)';
  }
}

// Update score display
function updateScores() {
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('aiScore').textContent = aiScore;
  
  const highScore = Math.max(playerScore, Storage.scores.get('tictactoe'));
  document.getElementById('highScore').textContent = highScore;
  
  if (playerScore > Storage.scores.get('tictactoe')) {
    Storage.scores.set('tictactoe', playerScore);
  }
}

// Load scores
function loadTicTacToeScores() {
  const highScore = Storage.scores.get('tictactoe');
  document.getElementById('highScore').textContent = highScore;
}

// Reset game
function resetTicTacToe() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  
  const cells = document.querySelectorAll('.ttt-cell');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken', 'winner');
  });
  
  updateStatus();
}

// Reset all scores
function resetScores() {
  if (confirm('Are you sure you want to reset all scores?')) {
    playerScore = 0;
    aiScore = 0;
    Storage.scores.set('tictactoe', 0);
    updateScores();
    Utils.notify('Scores reset!', 'info');
  }
}

// Update display
function updateDisplay() {
  updateStatus();
  updateScores();
}

// Initialize when loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTicTacToe);
} else {
  initTicTacToe();
}

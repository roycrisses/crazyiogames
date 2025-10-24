// Rock Paper Scissors Game Logic

const choices = {
  rock: { emoji: '✊', beats: 'scissors' },
  paper: { emoji: '✋', beats: 'rock' },
  scissors: { emoji: '✌️', beats: 'paper' }
};

let wins = 0;
let losses = 0;
let ties = 0;

// Initialize game
function initRPS() {
  loadRPSScores();
}

// Play game
function playRPS(playerChoice) {
  const computerChoice = getComputerChoice();
  
  // Display choices
  document.getElementById('playerChoice').textContent = choices[playerChoice].emoji;
  document.getElementById('computerChoice').textContent = choices[computerChoice].emoji;
  
  // Determine winner
  const result = determineWinner(playerChoice, computerChoice);
  
  // Update stats
  if (result === 'win') {
    wins++;
    document.getElementById('rpsResult').textContent = '🎉 You Win!';
    document.getElementById('rpsResult').style.color = '#10b981';
    Storage.player.updateStats(true);
  } else if (result === 'lose') {
    losses++;
    document.getElementById('rpsResult').textContent = '😔 You Lose!';
    document.getElementById('rpsResult').style.color = 'var(--accent)';
    Storage.player.updateStats(false);
  } else {
    ties++;
    document.getElementById('rpsResult').textContent = "🤝 It's a Tie!";
    document.getElementById('rpsResult').style.color = 'var(--primary)';
  }
  
  updateRPSDisplay();
  saveRPSScores();
}

// Get computer choice
function getComputerChoice() {
  const choiceKeys = Object.keys(choices);
  return choiceKeys[Math.floor(Math.random() * choiceKeys.length)];
}

// Determine winner
function determineWinner(player, computer) {
  if (player === computer) {
    return 'tie';
  }
  
  if (choices[player].beats === computer) {
    return 'win';
  }
  
  return 'lose';
}

// Update display
function updateRPSDisplay() {
  document.getElementById('rpsWins').textContent = wins;
  document.getElementById('rpsLosses').textContent = losses;
  document.getElementById('rpsTies').textContent = ties;
}

// Save scores
function saveRPSScores() {
  Storage.set('rpsScores', { wins, losses, ties });
}

// Load scores
function loadRPSScores() {
  const saved = Storage.get('rpsScores', { wins: 0, losses: 0, ties: 0 });
  wins = saved.wins;
  losses = saved.losses;
  ties = saved.ties;
  updateRPSDisplay();
}

// Reset scores
function resetRPSScores() {
  if (confirm('Are you sure you want to reset all scores?')) {
    wins = 0;
    losses = 0;
    ties = 0;
    updateRPSDisplay();
    saveRPSScores();
    document.getElementById('playerChoice').textContent = '?';
    document.getElementById('computerChoice').textContent = '?';
    document.getElementById('rpsResult').textContent = 'Make your choice!';
    document.getElementById('rpsResult').style.color = 'var(--primary)';
    Utils.notify('Scores reset!', 'info');
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRPS);
} else {
  initRPS();
}

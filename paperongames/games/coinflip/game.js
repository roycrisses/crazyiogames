// Coin Flip Game Logic

let correct = 0;
let wrong = 0;
let streak = 0;
let isFlipping = false;

// Initialize game
function initCoinFlip() {
  loadCoinStats();
}

// Flip coin
function flipCoin(prediction) {
  if (isFlipping) return;
  
  isFlipping = true;
  const coin = document.getElementById('coin');
  const result = Math.random() < 0.5 ? 'heads' : 'tails';
  
  // Disable buttons
  document.getElementById('headsBtn').disabled = true;
  document.getElementById('tailsBtn').disabled = true;
  
  // Add flipping animation
  coin.classList.add('flipping');
  
  // Determine final rotation based on result
  setTimeout(() => {
    coin.classList.remove('flipping');
    
    if (result === 'heads') {
      coin.style.transform = 'rotateY(0deg)';
    } else {
      coin.style.transform = 'rotateY(180deg)';
    }
    
    // Check if prediction was correct
    const resultEl = document.getElementById('coinResult');
    if (prediction === result) {
      correct++;
      streak++;
      resultEl.textContent = `🎉 Correct! It was ${result}!`;
      resultEl.style.color = '#10b981';
      Storage.player.updateStats(true);
      
      if (streak >= 5) {
        Utils.notify(`Amazing! ${streak} in a row! 🔥`, 'success');
      }
    } else {
      wrong++;
      streak = 0;
      resultEl.textContent = `😔 Wrong! It was ${result}!`;
      resultEl.style.color = 'var(--accent)';
      Storage.player.updateStats(false);
    }
    
    updateCoinDisplay();
    saveCoinStats();
    
    // Re-enable buttons
    document.getElementById('headsBtn').disabled = false;
    document.getElementById('tailsBtn').disabled = false;
    isFlipping = false;
  }, 1000);
}

// Update display
function updateCoinDisplay() {
  document.getElementById('coinCorrect').textContent = correct;
  document.getElementById('coinWrong').textContent = wrong;
  document.getElementById('coinStreak').textContent = streak;
}

// Save stats
function saveCoinStats() {
  Storage.set('coinStats', { correct, wrong, streak });
}

// Load stats
function loadCoinStats() {
  const saved = Storage.get('coinStats', { correct: 0, wrong: 0, streak: 0 });
  correct = saved.correct;
  wrong = saved.wrong;
  streak = saved.streak;
  updateCoinDisplay();
}

// Reset stats
function resetCoinStats() {
  if (confirm('Are you sure you want to reset all stats?')) {
    correct = 0;
    wrong = 0;
    streak = 0;
    updateCoinDisplay();
    saveCoinStats();
    
    const coin = document.getElementById('coin');
    coin.style.transform = 'rotateY(0deg)';
    
    document.getElementById('coinResult').textContent = 'Make your prediction!';
    document.getElementById('coinResult').style.color = 'var(--primary)';
    Utils.notify('Stats reset!', 'info');
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCoinFlip);
} else {
  initCoinFlip();
}

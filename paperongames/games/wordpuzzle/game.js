// Word Puzzle Game Logic

const words = [
  { word: 'JAVASCRIPT', hint: 'A popular programming language' },
  { word: 'COMPUTER', hint: 'Electronic device for processing data' },
  { word: 'KEYBOARD', hint: 'Input device with keys' },
  { word: 'BROWSER', hint: 'Software for accessing the web' },
  { word: 'INTERNET', hint: 'Global network of computers' },
  { word: 'ALGORITHM', hint: 'Step-by-step problem-solving procedure' },
  { word: 'MOUNTAIN', hint: 'Large natural elevation' },
  { word: 'ELEPHANT', hint: 'Largest land animal' },
  { word: 'RAINBOW', hint: 'Colorful arc in the sky' },
  { word: 'BUTTERFLY', hint: 'Insect with colorful wings' },
  { word: 'CHOCOLATE', hint: 'Sweet brown confection' },
  { word: 'GUITAR', hint: 'String musical instrument' },
  { word: 'UNIVERSE', hint: 'All of space and time' },
  { word: 'DIAMOND', hint: 'Precious gemstone' },
  { word: 'VOLCANO', hint: 'Mountain that erupts' },
  { word: 'PENGUIN', hint: 'Flightless bird from Antarctica' },
  { word: 'TREASURE', hint: 'Valuable hidden items' },
  { word: 'PYRAMID', hint: 'Ancient Egyptian structure' },
  { word: 'DOLPHIN', hint: 'Intelligent marine mammal' },
  { word: 'LIBRARY', hint: 'Place for books' }
];

let currentWord = '';
let scrambledWord = '';
let score = 0;
let timerInterval;
let seconds = 0;
let hintUsed = false;

// Initialize game
function initWordPuzzle() {
  loadWordPuzzleScore();
  startNewWord();
  startTimer();
  
  const input = document.getElementById('wordInput');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      checkWordPuzzle();
    }
  });
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
  document.getElementById('wpTimer').textContent = 
    `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Start new word
function startNewWord() {
  const randomWord = words[Math.floor(Math.random() * words.length)];
  currentWord = randomWord.word;
  scrambledWord = scrambleWord(currentWord);
  hintUsed = false;
  
  document.getElementById('scrambledWord').textContent = scrambledWord;
  document.getElementById('hint').textContent = 'Click "Hint" for help';
  document.getElementById('wordInput').value = '';
  document.getElementById('wpMessage').textContent = '';
  document.getElementById('wordInput').focus();
}

// Scramble word
function scrambleWord(word) {
  let scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
  
  // Make sure it's actually scrambled
  if (scrambled === word && word.length > 1) {
    return scrambleWord(word);
  }
  
  return scrambled;
}

// Check answer
function checkWordPuzzle() {
  const input = document.getElementById('wordInput');
  const answer = input.value.toUpperCase().trim();
  const message = document.getElementById('wpMessage');
  
  if (!answer) {
    return;
  }
  
  if (answer === currentWord) {
    const points = hintUsed ? 1 : 2;
    score += points;
    updateScore();
    
    message.textContent = `🎉 Correct! +${points} points`;
    message.className = 'wp-message success';
    
    Storage.player.updateStats(true);
    
    setTimeout(() => {
      startNewWord();
    }, 1500);
  } else {
    message.textContent = '❌ Wrong! Try again';
    message.className = 'wp-message error';
    input.value = '';
  }
}

// Show hint
function showWordHint() {
  if (!hintUsed) {
    const wordData = words.find(w => w.word === currentWord);
    if (wordData) {
      document.getElementById('hint').textContent = `💡 ${wordData.hint}`;
      hintUsed = true;
    }
  }
}

// Skip word
function skipWord() {
  const message = document.getElementById('wpMessage');
  message.textContent = `The word was: ${currentWord}`;
  message.className = 'wp-message error';
  
  setTimeout(() => {
    startNewWord();
  }, 2000);
}

// Update score
function updateScore() {
  document.getElementById('wpScore').textContent = score;
  
  const highScore = Storage.scores.get('wordpuzzle');
  if (score > highScore) {
    Storage.scores.set('wordpuzzle', score);
    document.getElementById('wpHighScore').textContent = score;
  }
}

// Load score
function loadWordPuzzleScore() {
  const highScore = Storage.scores.get('wordpuzzle');
  document.getElementById('wpHighScore').textContent = highScore;
}

// Reset game
function resetWordPuzzle() {
  if (confirm('Start a new game? Current score will be lost.')) {
    score = 0;
    seconds = 0;
    updateScore();
    updateTimer();
    startNewWord();
    Utils.notify('New game started!', 'info');
  }
}

// Cleanup
window.addEventListener('beforeunload', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWordPuzzle);
} else {
  initWordPuzzle();
}

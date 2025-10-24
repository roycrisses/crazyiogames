// Guess the Meaning Game Logic

const wordMeanings = [
  {
    word: "EPHEMERAL",
    correct: "Lasting for a very short time",
    wrong: ["Extremely large", "Very ancient", "Incredibly beautiful"]
  },
  {
    word: "LUMINOUS",
    correct: "Giving off light; bright or shining",
    wrong: ["Very dark", "Extremely heavy", "Highly intelligent"]
  },
  {
    word: "SERENDIPITY",
    correct: "Finding something good by accident",
    wrong: ["A state of sadness", "Extreme confusion", "Perfect timing"]
  },
  {
    word: "MELLIFLUOUS",
    correct: "Sweet or musical; pleasant to hear",
    wrong: ["Bitter tasting", "Rough texture", "Sharp and pointed"]
  },
  {
    word: "UBIQUITOUS",
    correct: "Present everywhere at once",
    wrong: ["Extremely rare", "Very ancient", "Highly valuable"]
  },
  {
    word: "ELOQUENT",
    correct: "Fluent and persuasive in speaking",
    wrong: ["Unable to speak", "Very quiet", "Extremely loud"]
  },
  {
    word: "RESILIENT",
    correct: "Able to recover quickly from difficulties",
    wrong: ["Very fragile", "Permanently damaged", "Extremely weak"]
  },
  {
    word: "VORACIOUS",
    correct: "Having a very eager appetite",
    wrong: ["Eating very little", "Moving slowly", "Sleeping often"]
  },
  {
    word: "PRISTINE",
    correct: "In its original condition; unspoiled",
    wrong: ["Very damaged", "Extremely old", "Recently created"]
  },
  {
    word: "METICULOUS",
    correct: "Showing great attention to detail",
    wrong: ["Very careless", "Extremely fast", "Highly creative"]
  },
  {
    word: "BENEVOLENT",
    correct: "Well-meaning and kindly",
    wrong: ["Evil and cruel", "Neutral and indifferent", "Angry and hostile"]
  },
  {
    word: "ENIGMATIC",
    correct: "Mysterious and difficult to understand",
    wrong: ["Very clear", "Extremely simple", "Completely obvious"]
  },
  {
    word: "VIVACIOUS",
    correct: "Attractively lively and animated",
    wrong: ["Very dull", "Extremely tired", "Highly aggressive"]
  },
  {
    word: "AUDACIOUS",
    correct: "Showing a willingness to take bold risks",
    wrong: ["Very timid", "Extremely careful", "Highly conservative"]
  },
  {
    word: "MUNDANE",
    correct: "Lacking excitement; dull",
    wrong: ["Very exciting", "Extremely unique", "Highly valuable"]
  }
];

let currentQuestions = [];
let currentIndex = 0;
let score = 0;

// Initialize game
function initGuessMeaning() {
  loadGMScore();
  startNewGame();
}

// Start new game
function startNewGame() {
  score = 0;
  currentIndex = 0;
  
  // Select 10 random words
  currentQuestions = shuffleArray(wordMeanings).slice(0, 10);
  
  updateScore();
  loadWord();
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

// Load word
function loadWord() {
  if (currentIndex >= currentQuestions.length) {
    gameComplete();
    return;
  }
  
  const word = currentQuestions[currentIndex];
  
  document.getElementById('gmWord').textContent = word.word;
  document.getElementById('gmQuestion').textContent = currentIndex + 1;
  document.getElementById('gmMessage').textContent = '';
  
  // Create options array and shuffle
  const allOptions = [word.correct, ...word.wrong];
  const shuffled = shuffleArray(allOptions);
  
  // Display options
  const optionsContainer = document.getElementById('gmOptions');
  optionsContainer.innerHTML = '';
  
  shuffled.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'gm-option';
    optionDiv.textContent = option;
    optionDiv.onclick = () => selectAnswer(option, word.correct);
    optionsContainer.appendChild(optionDiv);
  });
}

// Select answer
function selectAnswer(selected, correct) {
  const options = document.querySelectorAll('.gm-option');
  const message = document.getElementById('gmMessage');
  
  // Disable all options
  options.forEach(opt => opt.classList.add('disabled'));
  
  if (selected === correct) {
    // Find and mark correct option
    options.forEach(opt => {
      if (opt.textContent === correct) {
        opt.classList.add('correct');
      }
    });
    
    score++;
    updateScore();
    message.textContent = '✅ Correct!';
    message.style.color = '#10b981';
  } else {
    // Mark wrong and show correct
    options.forEach(opt => {
      if (opt.textContent === selected) {
        opt.classList.add('wrong');
      }
      if (opt.textContent === correct) {
        opt.classList.add('correct');
      }
    });
    
    message.textContent = '❌ Wrong!';
    message.style.color = 'var(--accent)';
  }
  
  // Move to next word
  currentIndex++;
  setTimeout(() => {
    loadWord();
  }, 2000);
}

// Update score
function updateScore() {
  document.getElementById('gmScore').textContent = score;
}

// Game complete
function gameComplete() {
  const message = document.getElementById('gmMessage');
  message.textContent = `🎉 Game Complete! Score: ${score}/10`;
  message.style.color = 'var(--primary)';
  
  document.getElementById('gmWord').textContent = '✓';
  document.getElementById('gmOptions').innerHTML = 
    `<div style="text-align: center; padding: 2rem; background: var(--background); border-radius: 10px;">
      <h3>You got ${score} out of 10 correct!</h3>
      <p>Great job expanding your vocabulary!</p>
    </div>`;
  
  // Update best score
  const bestScore = Storage.scores.get('guessmeaning');
  if (score > bestScore) {
    Storage.scores.set('guessmeaning', score);
    document.getElementById('gmBest').textContent = score;
    message.textContent += ' 🏆 New Best!';
  }
  
  Storage.player.updateStats(score >= 5);
  
  if (score >= 8) {
    Utils.notify('Excellent vocabulary! 🌟', 'success');
  }
}

// Load best score
function loadGMScore() {
  const bestScore = Storage.scores.get('guessmeaning');
  document.getElementById('gmBest').textContent = bestScore;
}

// Reset game
function resetGuessMeaning() {
  startNewGame();
  Utils.notify('New game started!', 'info');
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGuessMeaning);
} else {
  initGuessMeaning();
}

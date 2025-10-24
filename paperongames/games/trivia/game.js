// Trivia Quiz Game Logic

const triviaQuestions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correct: 2
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correct: 3
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correct: 2
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2
  },
  {
    question: "Which is the largest mammal?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correct: 1
  },
  {
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correct: 2
  },
  {
    question: "What is the speed of light?",
    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
    correct: 0
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correct: 1
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correct: 1
  },
  {
    question: "How many bones are in the human body?",
    options: ["196", "206", "216", "226"],
    correct: 1
  },
  {
    question: "What is the tallest mountain in the world?",
    options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"],
    correct: 2
  },
  {
    question: "Which programming language is known as the 'language of the web'?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correct: 2
  },
  {
    question: "What is the currency of Japan?",
    options: ["Yuan", "Won", "Yen", "Ringgit"],
    correct: 2
  }
];

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Initialize game
function initTriviaGame() {
  loadTriviaScore();
  startNewQuiz();
}

// Start new quiz
function startNewQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  
  // Select 10 random questions
  currentQuestions = shuffleArray(triviaQuestions).slice(0, 10);
  
  updateScore();
  loadQuestion();
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

// Load question
function loadQuestion() {
  if (currentQuestionIndex >= currentQuestions.length) {
    quizComplete();
    return;
  }
  
  const question = currentQuestions[currentQuestionIndex];
  
  document.getElementById('currentQ').textContent = currentQuestionIndex + 1;
  document.getElementById('questionNum').textContent = currentQuestionIndex + 1;
  document.getElementById('questionText').textContent = question.question;
  document.getElementById('triviaMessage').textContent = '';
  
  // Display options
  const optionsContainer = document.getElementById('triviaOptions');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'trivia-option';
    optionDiv.textContent = option;
    optionDiv.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(optionDiv);
  });
}

// Select answer
function selectAnswer(selectedIndex) {
  const question = currentQuestions[currentQuestionIndex];
  const options = document.querySelectorAll('.trivia-option');
  const message = document.getElementById('triviaMessage');
  
  // Disable all options
  options.forEach(opt => opt.classList.add('disabled'));
  
  if (selectedIndex === question.correct) {
    options[selectedIndex].classList.add('correct');
    score++;
    updateScore();
    message.textContent = '✅ Correct!';
    message.style.color = '#10b981';
  } else {
    options[selectedIndex].classList.add('wrong');
    options[question.correct].classList.add('correct');
    message.textContent = '❌ Wrong!';
    message.style.color = 'var(--accent)';
  }
  
  // Move to next question
  currentQuestionIndex++;
  setTimeout(() => {
    loadQuestion();
  }, 2000);
}

// Update score
function updateScore() {
  document.getElementById('triviaScore').textContent = score;
}

// Quiz complete
function quizComplete() {
  const message = document.getElementById('triviaMessage');
  message.textContent = `🎉 Quiz Complete! Final Score: ${score}/10`;
  message.style.color = 'var(--primary)';
  
  document.getElementById('questionText').textContent = 
    `You got ${score} out of 10 questions correct!`;
  document.getElementById('triviaOptions').innerHTML = '';
  
  // Update high score
  const highScore = Storage.scores.get('trivia');
  if (score > highScore) {
    Storage.scores.set('trivia', score);
    document.getElementById('triviaHigh').textContent = score;
    message.textContent += ' 🏆 New High Score!';
  }
  
  Storage.player.updateStats(score >= 5);
  
  if (score >= 8) {
    Utils.notify('Excellent! 🌟', 'success');
  } else if (score >= 5) {
    Utils.notify('Good job! 👍', 'success');
  }
}

// Load high score
function loadTriviaScore() {
  const highScore = Storage.scores.get('trivia');
  document.getElementById('triviaHigh').textContent = highScore;
}

// Reset game
function resetTriviaGame() {
  startNewQuiz();
  Utils.notify('New quiz started!', 'info');
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTriviaGame);
} else {
  initTriviaGame();
}

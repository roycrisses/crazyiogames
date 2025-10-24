// Main JavaScript for SimplePlay
// Made with care (and too much coffee ☕)

// Easter egg for curious developers
console.log('%c👀 Found the secret?', 'font-size: 20px; font-weight: bold; color: #EF233C;');
console.log('%cYou\'re a true gamer! 🎮✨', 'font-size: 14px; color: #FFD166;');
console.log('%cEnjoy exploring the code! Built with vanilla JS, no frameworks needed.', 'font-size: 12px; color: #8D99AE;');

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  setActiveNavLink();
  initScrollAnimations();
});

// Navigation Toggle for Mobile
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }
}

// Set Active Navigation Link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.game-card, .section').forEach(el => {
    observer.observe(el);
  });
}

// Load Game Dynamically
function loadGame(gameName) {
  const gameMapping = {
    'tictactoe': 'Tic Tac Toe',
    'connectrope': 'Connect Rope',
    'wordpuzzle': 'Word Puzzle',
    'guessmeaning': 'Guess the Meaning',
    'trivia': 'Trivia Quiz',
    'memory': 'Memory Match',
    'coinflip': 'Coin Flip',
    'rps': 'Rock Paper Scissors'
  };

  const displayName = gameMapping[gameName] || gameName;
  window.location.href = `game.html?id=${gameName}`;
}

// Utility Functions
const Utils = {
  // Format time
  formatTime: (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // Random integer
  randomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Shuffle array
  shuffle: (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  },

  // Show notification
  notify: (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

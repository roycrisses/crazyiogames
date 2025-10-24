// Chat System for SimplePlay (localStorage-based)

let chatRefreshInterval;
let currentUser = Storage.player.getName();

// Initialize Chat
function initChat() {
  currentUser = Storage.player.getName();
  setupChatUI();
  loadMessages();
  startAutoRefresh();
  addBotPresence();
}

// Setup Chat UI
function setupChatUI() {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const nicknameBtn = document.getElementById('changeNickname');
  const clearChatBtn = document.getElementById('clearChat');

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage();
    });
  }

  if (nicknameBtn) {
    nicknameBtn.addEventListener('click', changeNickname);
  }

  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', clearChat);
  }

  // Update nickname display
  updateNicknameDisplay();
}

// Send Message
function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();

  if (message) {
    Storage.chat.addMessage(currentUser, message);
    chatInput.value = '';
    loadMessages();
    scrollToBottom();

    // Sometimes trigger a bot response
    if (Math.random() < 0.3) {
      setTimeout(() => {
        addBotResponse();
        loadMessages();
        scrollToBottom();
      }, 1000 + Math.random() * 2000);
    }
  }
}

// Load and Display Messages
function loadMessages() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;

  const messages = Storage.chat.getMessages();
  chatMessages.innerHTML = '';

  messages.forEach(msg => {
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message';
    
    const isCurrentUser = msg.user === currentUser;
    if (isCurrentUser) {
      messageEl.classList.add('own-message');
    }

    messageEl.innerHTML = `
      <div class="message-header">
        <span class="message-user">${escapeHtml(msg.user)}</span>
        <span class="message-time">${msg.timestamp}</span>
      </div>
      <div class="message-text">${escapeHtml(msg.message)}</div>
    `;

    chatMessages.appendChild(messageEl);
  });
}

// Change Nickname
function changeNickname() {
  const newName = prompt('Enter your nickname:', currentUser);
  if (newName && newName.trim()) {
    currentUser = newName.trim();
    Storage.player.setName(currentUser);
    updateNicknameDisplay();
    Utils.notify('Nickname updated!', 'success');
  }
}

// Update Nickname Display
function updateNicknameDisplay() {
  const nicknameDisplay = document.getElementById('currentNickname');
  if (nicknameDisplay) {
    nicknameDisplay.textContent = currentUser;
  }
}

// Clear Chat
function clearChat() {
  if (confirm('Are you sure you want to clear all chat messages?')) {
    Storage.chat.clear();
    loadMessages();
    Utils.notify('Chat cleared', 'info');
  }
}

// Auto Refresh Messages
function startAutoRefresh() {
  chatRefreshInterval = setInterval(() => {
    loadMessages();
  }, 2000);
}

function stopAutoRefresh() {
  if (chatRefreshInterval) {
    clearInterval(chatRefreshInterval);
  }
}

// Scroll to Bottom
function scrollToBottom() {
  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Bot Responses (to simulate activity)
const botNames = ['GameBot', 'CasualGamer', 'QuizMaster', 'PixelPal', 'ChillVibes'];
const botMessages = [
  'This site is cozy! Love it 🎮',
  'Just beat my high score! Finally! 🎉',
  'Anyone else playing on their break?',
  'These games are perfect for unwinding',
  'No ads = instant win 💯',
  'Tic Tac Toe AI is tough!',
  'Memory Match is my jam 🧠',
  'Just got 8/10 on trivia!',
  'This is what gaming should be',
  'Found this randomly, glad I did',
  'Simple but addicting',
  'Playing Word Puzzle during lunch break',
  'The vibes here are immaculate ✨',
  'Coin flip gave me 5 streak! Lucky day',
  'Who else loves retro-style games?'
];

function addBotResponse() {
  const botName = botNames[Math.floor(Math.random() * botNames.length)];
  const botMessage = botMessages[Math.floor(Math.random() * botMessages.length)];
  Storage.chat.addMessage(botName, botMessage);
}

function addBotPresence() {
  // Add initial bot messages if chat is empty
  const messages = Storage.chat.getMessages();
  if (messages.length === 0) {
    setTimeout(() => {
      Storage.chat.addMessage('GameBot', 'Welcome! This chat is just for fun 😊 Share your scores or just say hi!');
      loadMessages();
      scrollToBottom();
    }, 1000);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopAutoRefresh();
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChat);
} else {
  initChat();
}

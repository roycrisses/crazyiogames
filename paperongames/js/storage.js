// LocalStorage Management for SimplePlay

const Storage = {
  // Get data from localStorage
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return defaultValue;
    }
  },

  // Set data to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} to storage:`, error);
      return false;
    }
  },

  // Remove item from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },

  // High Scores Management
  scores: {
    get: (gameName) => {
      const scores = Storage.get('highScores', {});
      return scores[gameName] || 0;
    },

    set: (gameName, score) => {
      const scores = Storage.get('highScores', {});
      if (!scores[gameName] || score > scores[gameName]) {
        scores[gameName] = score;
        Storage.set('highScores', scores);
        return true;
      }
      return false;
    },

    getAll: () => {
      return Storage.get('highScores', {});
    }
  },

  // Player Profile
  player: {
    getName: () => {
      return Storage.get('playerName', 'Player');
    },

    setName: (name) => {
      Storage.set('playerName', name);
    },

    getStats: () => {
      return Storage.get('playerStats', {
        gamesPlayed: 0,
        totalWins: 0,
        totalLosses: 0
      });
    },

    updateStats: (win = false) => {
      const stats = Storage.player.getStats();
      stats.gamesPlayed++;
      if (win) {
        stats.totalWins++;
      } else {
        stats.totalLosses++;
      }
      Storage.set('playerStats', stats);
    }
  },

  // Chat Data
  chat: {
    getMessages: () => {
      return Storage.get('chatMessages', []);
    },

    addMessage: (user, message) => {
      const messages = Storage.chat.getMessages();
      messages.push({
        user,
        message,
        timestamp: new Date().toLocaleTimeString()
      });
      // Keep only last 100 messages
      if (messages.length > 100) {
        messages.shift();
      }
      Storage.set('chatMessages', messages);
    },

    clear: () => {
      Storage.set('chatMessages', []);
    }
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}

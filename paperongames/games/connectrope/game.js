// Connect Rope Game Logic

const canvas = document.getElementById('connectCanvas');
const ctx = canvas.getContext('2d');

const levels = [
  // Level 1 - Simple square
  [
    { x: 100, y: 100, pair: 0 },
    { x: 300, y: 100, pair: 0 },
    { x: 100, y: 300, pair: 1 },
    { x: 300, y: 300, pair: 1 }
  ],
  // Level 2
  [
    { x: 50, y: 200, pair: 0 },
    { x: 350, y: 200, pair: 0 },
    { x: 200, y: 50, pair: 1 },
    { x: 200, y: 350, pair: 1 }
  ],
  // Level 3
  [
    { x: 50, y: 50, pair: 0 },
    { x: 350, y: 350, pair: 0 },
    { x: 350, y: 50, pair: 1 },
    { x: 50, y: 350, pair: 1 },
    { x: 200, y: 200, pair: 2 },
    { x: 200, y: 100, pair: 2 }
  ]
];

const colors = ['#EF233C', '#2B2D42', '#8D99AE'];

let currentLevel = 0;
let dots = [];
let paths = [];
let selectedDot = null;
let moves = 0;
let isDrawing = false;

// Initialize game
function initConnectRope() {
  loadConnectRopeStats();
  setupCanvas();
  loadLevel(currentLevel);
  
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  
  // Touch events
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchmove', handleTouchMove);
  canvas.addEventListener('touchend', handleTouchEnd);
}

// Setup canvas
function setupCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = 400 * dpr;
  canvas.height = 400 * dpr;
  ctx.scale(dpr, dpr);
  
  canvas.style.width = '400px';
  canvas.style.height = '400px';
}

// Load level
function loadLevel(level) {
  dots = JSON.parse(JSON.stringify(levels[level]));
  paths = [];
  moves = 0;
  selectedDot = null;
  isDrawing = false;
  
  document.getElementById('crLevel').textContent = level + 1;
  document.getElementById('crMoves').textContent = moves;
  document.getElementById('crMessage').textContent = '';
  
  draw();
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, 400, 400);
  
  // Draw paths
  paths.forEach(path => {
    ctx.strokeStyle = colors[path.pair];
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(path.start.x, path.start.y);
    ctx.lineTo(path.end.x, path.end.y);
    ctx.stroke();
  });
  
  // Draw dots
  dots.forEach(dot => {
    ctx.fillStyle = colors[dot.pair];
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
  });
}

// Get mouse position
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (400 / rect.width),
    y: (e.clientY - rect.top) * (400 / rect.height)
  };
}

// Handle mouse down
function handleMouseDown(e) {
  const pos = getMousePos(e);
  const dot = findDotAt(pos);
  
  if (dot) {
    selectedDot = dot;
    isDrawing = true;
  }
}

// Handle mouse move
function handleMouseMove(e) {
  if (!isDrawing || !selectedDot) return;
  
  const pos = getMousePos(e);
  draw();
  
  // Draw temporary line
  ctx.strokeStyle = colors[selectedDot.pair];
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(selectedDot.x, selectedDot.y);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Handle mouse up
function handleMouseUp(e) {
  if (!isDrawing || !selectedDot) return;
  
  const pos = getMousePos(e);
  const endDot = findDotAt(pos);
  
  if (endDot && endDot !== selectedDot && endDot.pair === selectedDot.pair) {
    // Check if connection already exists
    const exists = paths.some(p =>
      (p.start === selectedDot && p.end === endDot) ||
      (p.start === endDot && p.end === selectedDot)
    );
    
    if (!exists) {
      paths.push({ start: selectedDot, end: endDot, pair: selectedDot.pair });
      moves++;
      document.getElementById('crMoves').textContent = moves;
    }
  }
  
  selectedDot = null;
  isDrawing = false;
  draw();
}

// Touch handlers
function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
}

function handleTouchEnd(e) {
  e.preventDefault();
  const touch = e.changedTouches[0];
  handleMouseUp({ clientX: touch.clientX, clientY: touch.clientY });
}

// Find dot at position
function findDotAt(pos) {
  return dots.find(dot => {
    const dx = dot.x - pos.x;
    const dy = dot.y - pos.y;
    return Math.sqrt(dx * dx + dy * dy) < 20;
  });
}

// Check solution
function checkSolution() {
  const message = document.getElementById('crMessage');
  
  // Count unique pairs
  const uniquePairs = new Set(dots.map(d => d.pair));
  const connectedPairs = new Set(paths.map(p => p.pair));
  
  if (connectedPairs.size !== uniquePairs.size) {
    message.textContent = '❌ Not all pairs connected!';
    message.style.color = 'var(--accent)';
    return;
  }
  
  // Check for line intersections
  if (pathsIntersect()) {
    message.textContent = '❌ Lines are crossing!';
    message.style.color = 'var(--accent)';
    return;
  }
  
  // Level complete!
  message.textContent = '🎉 Level Complete!';
  message.style.color = '#10b981';
  
  const bestLevel = Storage.scores.get('connectrope');
  if (currentLevel + 1 > bestLevel) {
    Storage.scores.set('connectrope', currentLevel + 1);
    document.getElementById('crBest').textContent = `Level ${currentLevel + 1}`;
  }
  
  Storage.player.updateStats(true);
  Utils.notify('Level complete! 🎉', 'success');
  
  // Move to next level
  if (currentLevel < levels.length - 1) {
    setTimeout(() => {
      currentLevel++;
      loadLevel(currentLevel);
      message.textContent = '';
    }, 2000);
  } else {
    setTimeout(() => {
      message.textContent = '🏆 All levels complete!';
      Utils.notify('You completed all levels! 🏆', 'success');
    }, 2000);
  }
}

// Check if paths intersect
function pathsIntersect() {
  for (let i = 0; i < paths.length; i++) {
    for (let j = i + 1; j < paths.length; j++) {
      if (linesIntersect(paths[i], paths[j])) {
        return true;
      }
    }
  }
  return false;
}

// Check if two lines intersect
function linesIntersect(line1, line2) {
  const p1 = line1.start, p2 = line1.end;
  const p3 = line2.start, p4 = line2.end;
  
  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (denom === 0) return false;
  
  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
  
  return ua > 0 && ua < 1 && ub > 0 && ub < 1;
}

// Reset level
function resetLevel() {
  loadLevel(currentLevel);
  Utils.notify('Level reset', 'info');
}

// Clear all paths
function clearPaths() {
  paths = [];
  moves = 0;
  document.getElementById('crMoves').textContent = moves;
  draw();
}

// Load stats
function loadConnectRopeStats() {
  const bestLevel = Storage.scores.get('connectrope');
  if (bestLevel > 0) {
    document.getElementById('crBest').textContent = `Level ${bestLevel}`;
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initConnectRope);
} else {
  initConnectRope();
}

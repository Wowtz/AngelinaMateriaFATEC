const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlaySub = document.getElementById('overlay-sub');

const COLS = 20;
const ROWS = 20;
const CELL = canvas.width / COLS; // 20px

const COLOR_HEAD   = '#7a14ff'; 
const COLOR_BODY   = '#0c86a8';
const COLOR_FOOD   = '#22ff98';
const COLOR_GRID   = '#131313';

let snake, dir, nextDir, food, score, highscore, running, interval;

highscore = 0;

function fmt(n) {
  return String(n).padStart(3, '0');
}

function init() {
  snake = [
    { x: 10, y: 10 },
    { x: 9,  y: 10 },
    { x: 8,  y: 10 },
  ];
  dir     = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score   = 0;
  scoreEl.textContent = fmt(score);
  spawnFood();
  running = true;
  clearInterval(interval);
  interval = setInterval(tick, 120);
}

function spawnFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  food = pos;
}

function tick() {
  if (!running) return;

  dir = nextDir;

  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y,
  };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    die(); return;
  }

  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    die(); return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = fmt(score);
    if (score > highscore) {
      highscore = score;
      highscoreEl.textContent = fmt(highscore);
    }
    spawnFood();
    // speed up slightly every 5 points
    if (score % 5 === 0) {
      clearInterval(interval);
      const speed = Math.max(60, 120 - score * 3);
      interval = setInterval(tick, speed);
    }
  } else {
    snake.pop();
  }

  draw();
}

function die() {
  running = false;
  clearInterval(interval);
  overlayTitle.textContent = 'FIM';
  overlayTitle.classList.add('dead');
  overlaySub.textContent = `pontos: ${fmt(score)} — enter para jogar novamente`;
  overlay.classList.remove('hidden');
}

function draw() {
  // Background grid
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = COLOR_GRID;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL, 0);
    ctx.lineTo(i * CELL, canvas.height);
    ctx.stroke();
  }
  for (let j = 0; j <= ROWS; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * CELL);
    ctx.lineTo(canvas.width, j * CELL);
    ctx.stroke();
  }

  // Food — pulsing dot
  const t = Date.now() / 400;
  const glow = 4 + 2 * Math.sin(t);
  ctx.shadowBlur = glow * 2;
  ctx.shadowColor = COLOR_FOOD;
  ctx.fillStyle = COLOR_FOOD;
  const fx = food.x * CELL + CELL / 2;
  const fy = food.y * CELL + CELL / 2;
  ctx.beginPath();
  ctx.arc(fx, fy, CELL / 2 - 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Snake
  snake.forEach((seg, i) => {
    const x = seg.x * CELL + 1;
    const y = seg.y * CELL + 1;
    const s = CELL - 2;

    if (i === 0) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = COLOR_HEAD;
      ctx.fillStyle = COLOR_HEAD;
    } else {
      const fade = 1 - (i / snake.length) * 0.6;
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(31, 168, 12, ${fade})`;
    }

    ctx.beginPath();
    ctx.roundRect(x, y, s, s, i === 0 ? 4 : 2);
    ctx.fill();
  });

  ctx.shadowBlur = 0;
}

// Controls
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (!running) {
      overlayTitle.textContent = 'COBRA';
      overlayTitle.classList.remove('dead');
      overlaySub.textContent = 'pressione ENTER para jogar';
      overlay.classList.add('hidden');
      init();
    }
    return;
  }

  const map = {
    w: { x:  0, y: -1 },
    a: { x: -1, y:  0 },
    s: { x:  0, y:  1 },
    d: { x:  1, y:  0 },
    ArrowUp:    { x:  0, y: -1 },
    ArrowLeft:  { x: -1, y:  0 },
    ArrowDown:  { x:  0, y:  1 },
    ArrowRight: { x:  1, y:  0 },
  };

  const d = map[e.key];
  if (!d) return;

  // Prevent reversing
  if (d.x === -dir.x && d.y === -dir.y) return;
  nextDir = d;

  // Prevent arrow keys from scrolling page
  if (e.key.startsWith('Arrow')) e.preventDefault();
});

// Initial draw
draw();
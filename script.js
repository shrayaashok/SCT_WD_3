const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status");
const pvpBtn = document.getElementById("pvpBtn");
const cpuBtn = document.getElementById("cpuBtn");
const levelSelect = document.getElementById("levelSelect");
const resetBtn = document.getElementById("resetBtn");
const gameContainer = document.querySelector(".game-container");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameOver = false;
let vsComputer = false;
let difficulty = "easy";

// Winning patterns
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// When Play With Friend
pvpBtn.addEventListener("click", () => {
  vsComputer = false;
  startGame();
});

// When Play vs Computer
cpuBtn.addEventListener("click", () => {
  levelSelect.classList.remove("hidden");
});

// Select difficulty level
levelSelect.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    difficulty = btn.dataset.level;
    vsComputer = true;
    startGame();
  });
});

function startGame() {
  levelSelect.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  resetGame();
}

cells.forEach(cell => cell.addEventListener("click", handleClick));

function handleClick(e) {
  const idx = e.target.dataset.index;
  if (board[idx] !== "" || isGameOver) return;

  board[idx] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    statusText.textContent = `${currentPlayer} Wins! 🎉`;
    isGameOver = true;
    return;
  }

  if (board.every(c => c !== "")) {
    statusText.textContent = "It's a Draw! 🤝";
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (vsComputer && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let move;

  if (difficulty === "easy") move = randomMove();
  else if (difficulty === "medium") move = mediumMove();
  else move = bestMove(); // hard mode = unbeatable

  board[move] = "O";
  cells[move].textContent = "O";

  if (checkWin("O")) {
    statusText.textContent = "Computer Wins! 🤖";
    isGameOver = true;
    return;
  }

  if (board.every(c => c !== "")) {
    statusText.textContent = "It's a Draw!";
    isGameOver = true;
    return;
  }

  currentPlayer = "X";
}

// EASY MODE: Random
function randomMove() {
  const empty = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

// MEDIUM MODE: Block + Random
function mediumMove() {
  // 1. Try to win
  for (let combo of winPatterns) {
    let [a, b, c] = combo;
    let line = [board[a], board[b], board[c]];
    if (line.filter(v => v === "O").length === 2 && line.includes("")) return combo[line.indexOf("")];
  }

  // 2. Try to block
  for (let combo of winPatterns) {
    let [a, b, c] = combo;
    let line = [board[a], board[b], board[c]];
    if (line.filter(v => v === "X").length === 2 && line.includes("")) return combo[line.indexOf("")];
  }

  // 3. Else random
  return randomMove();
}

// HARD MODE: Unbeatable Minimax AI
function bestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

const scores = { X: -1, O: 1, tie: 0 };

function minimax(newBoard, depth, isMaximizing) {
  let result = getWinner();
  if (result !== null) return scores[result];

  if (isMaximizing) {
    let best = -Infinity;
    for (let i=0;i<9;i++){
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        best = Math.max(best, minimax(newBoard, depth+1, false));
        newBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i=0;i<9;i++){
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        best = Math.min(best, minimax(newBoard, depth+1, true));
        newBoard[i] = "";
      }
    }
    return best;
  }
}

function getWinner() {
  for (let combo of winPatterns) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
  }
  if (board.every(c => c !== "")) return "tie";
  return null;
}

function checkWin(player) {
  return winPatterns.some(pattern => pattern.every(i => board[i] === player));
}


// RESET
resetBtn.addEventListener("click", resetGame);

function resetGame() {
  board = ["","","","","","","","",""];
  currentPlayer = "X";
  isGameOver = false;
  statusText.textContent = "Your turn!";
  cells.forEach(cell => cell.textContent = "");
  resetBtn.classList.remove("hidden");
}

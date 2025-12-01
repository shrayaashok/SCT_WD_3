const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetBtn = document.getElementById('resetBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const computerBtn = document.getElementById('computerBtn');
const difficultyContainer = document.getElementById('difficultyContainer');
const difficultyBtns = document.querySelectorAll('.difficulty');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameOver = false;
let vsComputer = false;
let computerLevel = 'easy';

// Winning combinations
const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Mode selection
twoPlayerBtn.addEventListener('click', () => {
  vsComputer = false;
  difficultyContainer.style.display = 'none';
  resetGame();
});

computerBtn.addEventListener('click', () => {
  vsComputer = true;
  difficultyContainer.style.display = 'block';
});

// Difficulty selection
difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    computerLevel = btn.dataset.level;
    resetGame();
  });
});

// Cell click
cells.forEach(cell => cell.addEventListener('click', cellClick));

function cellClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== '' || isGameOver) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    statusText.textContent = `${currentPlayer} wins! 🎉`;
    isGameOver = true;
    return;
  }

  if (board.every(cell => cell !== '')) {
    statusText.textContent = `It's a draw! 🤝`;
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (vsComputer && currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  } else {
    statusText.textContent = `Current Player: ${currentPlayer}`;
  }
}

// Check winning
function checkWin(player) {
  return winCombos.some(combo => {
    return combo.every(index => board[index] === player);
  });
}

// Computer move
function computerMove() {
  let move;
  if (computerLevel === 'easy') {
    move = randomMove();
  } else if (computerLevel === 'medium') {
    move = mediumMove();
  } else {
    move = hardMove();
  }

  board[move] = 'O';
  cells[move].textContent = 'O';

  if (checkWin('O')) {
    statusText.textContent = `O wins! 🎉`;
    isGameOver = true;
    return;
  }

  if (board.every(cell => cell !== '')) {
    statusText.textContent = `It's a draw! 🤝`;
    isGameOver = true;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = `Current Player: ${currentPlayer}`;
}

// Easy: random move
function randomMove() {
  let emptyIndices = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

// Medium: block opponent or random
function mediumMove() {
  // First, try to win
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      if (checkWin('O')) return i;
      board[i] = '';
    }
  }
  // Then block player
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'X';
      if (checkWin('X')) {
        board[i] = '';
        return i;
      }
      board[i] = '';
    }
  }
  // Otherwise, random
  return randomMove();
}

// Hard: minimax algorithm
function hardMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWin('O')) return 10 - depth;
  if (checkWin('X')) return depth - 10;
  if (boardState.every(cell => cell !== '')) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === '') {
        boardState[i] = 'O';
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === '') {
        boardState[i] = 'X';
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Reset game
resetBtn.addEventListener('click', resetGame);

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameOver = false;
  statusText.textContent = `Current Player: ${currentPlayer}`;
  cells.forEach(cell => cell.textContent = '');
}

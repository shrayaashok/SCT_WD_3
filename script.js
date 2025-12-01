const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetBtn = document.getElementById('resetBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const computerBtn = document.getElementById('computerBtn');
const difficultyContainer = document.getElementById('difficultyContainer');
const difficultyBtns = document.querySelectorAll('.difficulty');
const winLine = document.getElementById('winLine');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameOver = false;
let vsComputer = false;
let computerLevel = 'easy';

// Winning combinations with line positions
const winCombos = [
  { combo:[0,1,2], style: 'translateY(0px) scaleX(1) rotate(0deg)' },
  { combo:[3,4,5], style: 'translateY(125px) scaleX(1) rotate(0deg)' },
  { combo:[6,7,8], style: 'translateY(250px) scaleX(1) rotate(0deg)' },
  { combo:[0,3,6], style: 'translateX(0px) scaleX(1) rotate(90deg)' },
  { combo:[1,4,7], style: 'translateX(125px) scaleX(1) rotate(90deg)' },
  { combo:[2,5,8], style: 'translateX(250px) scaleX(1) rotate(90deg)' },
  { combo:[0,4,8], style: 'translate(0,0) rotate(45deg) scaleX(1.5)' },
  { combo:[2,4,6], style: 'translate(0,0) rotate(-45deg) scaleX(1.5)' },
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

  const win = checkWin(currentPlayer);
  if (win) {
    showWinningLine(win.style);
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

// Show winning line
function showWinningLine(style) {
  winLine.style.transform = style;
  winLine.classList.add('show');
}

// Check winning
function checkWin(player) {
  for (let obj of winCombos) {
    if (obj.combo.every(index => board[index] === player)) {
      return obj;
    }
  }
  return null;
}

// Computer moves
function computerMove() {
  let move;
  if (computerLevel === 'easy') move = randomMove();
  else if (computerLevel === 'medium') move = mediumMove();
  else move = hardMove();

  board[move] = 'O';
  cells[move].textContent = 'O';

  const win = checkWin('O');
  if (win) {
    showWinningLine(win.style);
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
  let empty = board.map((val,i)=> val===''?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

// Medium: block or win
function mediumMove() {
  for (let i=0;i<board.length;i++){
    if(board[i]===''){ board[i]='O'; if(checkWin('O')) return i; board[i]=''; }
  }
  for (let i=0;i<board.length;i++){
    if(board[i]===''){ board[i]='X'; if(checkWin('X')){ board[i]=''; return i;} board[i]=''; }
  }
  return randomMove();
}

// Hard: minimax
function hardMove(){
  let best=-Infinity, move;
  for(let i=0;i<board.length;i++){
    if(board[i]===''){ board[i]='O'; let score=minimax(board,0,false); board[i]=''; if(score>best){best=score;move=i;} }
  }
  return move;
}

function minimax(b,d,isMax){
  if(checkWin('O')) return 10-d;
  if(checkWin('X')) return d-10;
  if(b.every(c=>c!=='')) return 0;
  if(isMax){
    let best=-Infinity;
    for(let i=0;i<b.length;i++){
      if(b[i]===''){ b[i]='O'; let s=minimax(b,d+1,false); b[i]=''; best=Math.max(s,best); }
    }
    return best;
  }else{
    let best=Infinity;
    for(let i=0;i<b.length;i++){
      if(b[i]===''){ b[i]='X'; let s=minimax(b,d+1,true); b[i]=''; best=Math.min(s,best); }
    }
    return best;
  }
}

// Reset game
resetBtn.addEventListener('click', resetGame);

function resetGame(){
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer='X';
  isGameOver=false;
  winLine.classList.remove('show');
  winLine.style.width='0';
  cells.forEach(c=>c.textContent='');
  statusText.textContent=`Current Player: ${currentPlayer}`;
}

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

// Image URLs
const X_IMG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Red_X.svg/1200px-Red_X.svg.png';
const O_IMG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Blue_circle.svg/1024px-Blue_circle.svg.png';

const winCombos = [
  { combo: [0,1,2], style: 'translateY(0px)' },
  { combo: [3,4,5], style: 'translateY(130px)' },
  { combo: [6,7,8], style: 'translateY(260px)' },
  { combo: [0,3,6], style: 'translateX(0px) rotate(90deg)' },
  { combo: [1,4,7], style: 'translateX(130px) rotate(90deg)' },
  { combo: [2,5,8], style: 'translateX(260px) rotate(90deg)' },
  { combo: [0,4,8], style: 'rotate(45deg) translateY(0)' },
  { combo: [2,4,6], style: 'rotate(-45deg) translateY(0)' }
];

twoPlayerBtn.addEventListener('click', () => {
  vsComputer = false;
  difficultyContainer.style.display = "none";
  resetGame();
});

computerBtn.addEventListener('click', () => {
  vsComputer = true;
  difficultyContainer.style.display = "block";
});

difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    computerLevel = btn.dataset.level;
    resetGame();
  });
});

cells.forEach(cell => cell.addEventListener('click', cellClick));

function cellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== '' || isGameOver) return;

  makeMove(index, currentPlayer);

  const win = checkWin(currentPlayer);
  if (win) return endGame(currentPlayer, win);

  if (board.every(cell => cell !== '')) return draw();

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (vsComputer && currentPlayer === 'O') {
    setTimeout(computerMove, 400);
  } else {
    statusText.textContent = `Current Player: ${currentPlayer}`;
  }
}

function makeMove(index, player) {
  board[index] = player;
  const img = document.createElement('img');
  img.src = player === 'X' ? X_IMG : O_IMG;
  img.style.width = '60px';
  img.style.height = '60px';
  cells[index].innerHTML = '';
  cells[index].appendChild(img);
}

function endGame(player, win) {
  winLine.style.transform = win.style;
  winLine.classList.add('show');
  statusText.textContent = `${player} wins! 🎉`;
  isGameOver = true;
}

function draw() {
  statusText.textContent = `It's a draw! 🤝`;
  isGameOver = true;
}

function checkWin(p) {
  for (let obj of winCombos) {
    if (obj.combo.every(i => board[i] === p)) return obj;
  }
  return null;
}

function computerMove() {
  let move;
  if (computerLevel === "easy") move = randomMove();
  else if (computerLevel === "medium") move = mediumMove();
  else move = hardMove();

  makeMove(move, 'O');

  const win = checkWin('O');
  if (win) return endGame('O', win);

  if (board.every(c => c !== '')) return draw();

  currentPlayer = 'X';
  statusText.textContent = `Current Player: ${currentPlayer}`;
}

function randomMove() {
  let empty = board.map((v,i)=> v===''?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function mediumMove() {
  for (let i=0;i<9;i++){
    if(board[i]===''){ board[i]='O'; if(checkWin('O')) return i; board[i]=''; }
  }
  for (let i=0;i<9;i++){
    if(board[i]===''){ board[i]='X'; if(checkWin('X')) return i; board[i]=''; }
  }
  return randomMove();
}

function hardMove(){
  let best = -Infinity, move;
  for (let i=0;i<9;i++){
    if(board[i]===''){
      board[i]='O';
      let score = minimax(board, 0, false);
      board[i]='';
      if(score > best){ best = score; move = i; }
    }
  }
  return move;
}

function minimax(b,d,isMax){
  if(checkWin('O')) return 10 - d;
  if(checkWin('X')) return d - 10;
  if(b.every(c=>c!=='')) return 0;

  if(isMax){
    let best = -Infinity;
    for (let i=0;i<9;i++){
      if(b[i]===''){
        b[i]='O';
        best = Math.max(best, minimax(b, d+1, false));
        b[i]='';
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i=0;i<9;i++){
      if(b[i]===''){
        b[i]='X';
        best = Math.min(best, minimax(b, d+1, true));
        b[i]='';
      }
    }
    return best;
  }
}

resetBtn.addEventListener('click', resetGame);

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameOver = false;
  cells.forEach(c => c.innerHTML = '');
  winLine.classList.remove('show');
  winLine.style.width = '0';
  statusText.textContent = "Current Player: X";
}

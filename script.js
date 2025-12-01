let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let vsComputer = false;
let difficulty = "easy";

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function generateBoard() {
    const boardDiv = document.getElementById("gameBoard");
    boardDiv.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.onclick = handleCellClick;
        boardDiv.appendChild(cell);
    }
}

function startFriendMode() {
    vsComputer = false;
    resetGame();
}

function toggleDifficultyMenu() {
    document.getElementById("difficultyMenu").style.display = "block";
}

function startComputerMode(level) {
    vsComputer = true;
    difficulty = level;
    resetGame();
}

function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    event.target.innerText = currentPlayer;

    if (checkWinner()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (vsComputer && currentPlayer === "O") {
        setTimeout(computerMove, 400);
    }
}

function computerMove() {
    let move;

    if (difficulty === "easy") {
        move = easyMove();
    } else if (difficulty === "medium") {
        move = mediumMove();
    } else {
        move = bestMove();
    }

    board[move] = "O";
    document.querySelector(`[data-index='${move}']`).innerText = "O";

    if (checkWinner()) return;
    currentPlayer = "X";
}

function easyMove() {
    const available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    return available[Math.floor(Math.random() * available.length)];
}

function mediumMove() {
    return easyMove();
}

function bestMove() {
    return easyMove();
}

function checkWinner() {
    for (let combo of winPatterns) {
        const [a, b, c] = combo;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.getElementById("statusText").innerText = `${board[a]} Wins!`;
            gameActive = false;
            return true;
        }
    }

    if (!board.includes("")) {
        document.getElementById("statusText").innerText = "It's a Draw!";
        gameActive = false;
        return true;
    }

    return false;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    document.getElementById("statusText").innerText = "";
    generateBoard();
}

generateBoard();
gameActive = true;

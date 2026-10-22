const ROWS = 6;
const COLUMNS = 7;
let currentPlayer = 1;
let gameOver = false;

let board = [];

function initializeBoard() {
    board = []
    for (let row = 0; row < ROWS; row++) {
        let line = [];
        for (let col = 0; col < COLUMNS; col++) {
            line.push(0);
        }
        board.push(line);
    }
}

initializeBoard();

console.log(board);



function createBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            const cell = document.createElement("button");
            cell.classList.add("cell");
            cell.type = "button";
            cell.dataset.row = row; 
            cell.dataset.column = col; 
            boardElement.appendChild(cell);
        }
    }
}

createBoard();



function play(column) {
    if (gameOver) {
        return;
    }

    // la ligne 5 est la plus basse donc on cherche la ligne vide la plus basse 
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][column] === 0) {
            board[row][column] = currentPlayer;
            updateCell(row, column);

            // on vérifie que si le joueur a placé un point qui le fait gagner 
            if (checkWinner(row, column, currentPlayer)) {
                const message = "Le joueur " + currentPlayer + " a gagné !";
                document.getElementById("status").textContent = message;
                showPopup(message);
                gameOver = true;
                return;
            }
            // on vérifie si il y a match nul
            else if(isDraw()){
                const message = "Match nul ! Aucun joueur n'a gagné !";
                document.getElementById("status").textContent = message;
                showPopup(message);
                gameOver = true; 
                return; 
            }

            // changement du joueur
            if(currentPlayer == 1){
                currentPlayer = 2; 
            }
            else if(currentPlayer == 2){
                currentPlayer = 1; 
            }
            updateStatus(); 
            break;
        }
    }
}


// modifie les classes des cellules ce qui permet de mofifier la couleur d'une cellule 
function updateCell(row, column) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-column="${column}"]`);
    if (board[row][column] === 1) {
        cell.classList.add("player1");
    } else if (board[row][column] === 2) {
        cell.classList.add("player2");
    }
}


// permet de réinitialiser le plateau à la fin d'une partie 
function updateBoard() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(function(cell) {
        cell.classList.remove("player1", "player2");
    });
}


// modifie la phrase qui indique le tour du joueur 
function updateStatus() {
    const status = document.getElementById("status");
    status.textContent = "Au tour du joueur " + currentPlayer;
}

updateStatus(); 


// compte le nombre de jetons d'un joueur dans une direction donnée 
function countPiece(row, col, rowStep, colStep, player) {
    let count = 0;
    let r = row + rowStep;
    let c = col + colStep;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLUMNS && board[r][c] === player) {
        count++;
        r += rowStep;
        c += colStep;
    }
    return count;
}


// vérifie si un joueur a gagné ou non 
function checkWinner(row, col, player) {
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonale descendante
        [1, -1]   // diagonale montante
    ];
    for (const [rowStep, colStep] of directions) {
        const count = 1 + countPiece(row, col, rowStep, colStep, player) + 
        countPiece(row, col, -rowStep, -colStep, player);
        if (count >= 4) {
            return true;
        }
    }
    return false;
}


// permet de vérifier si il y a match nul (vérifie que toutes les cases sont différentes de 0)
function isDraw() {
    return board.every(function(line) {
        return line.every(function(cell) {
            return cell !== 0;
        });
    });
}



function showPopup(message) {
    document.getElementById("popup-message").textContent = message;
    document.getElementById("popup").classList.remove("hidden");
}

function hidePopup() {
    document.getElementById("popup").classList.add("hidden");
}


function restartGame() {
    initializeBoard();
    updateBoard();
    updateStatus();
    hidePopup();
    currentPlayer = 1;
    gameOver = false;
}




// événements 

const boardElement = document.getElementById("board");
boardElement.addEventListener("click", function(event) {
    // on vérifie qu'on a bien cliqué sur une cellule et permet de ne pas traiter un clic inutile 
    const cell = event.target.closest(".cell");
    if (cell === null) {
        return;
    }
    const column = Number(cell.dataset.column);
    play(column);
});


const restartButton = document.getElementById("restart");
restartButton.addEventListener("click", restartGame);

const popupRestartButton = document.getElementById("popup-restart");
popupRestartButton.addEventListener("click", restartGame);
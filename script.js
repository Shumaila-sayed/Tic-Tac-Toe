// Gameboard module
const Gameboard = (() => {
    let board = Array(9).fill(""); // Create a board with 9 empty spaces

    return {
        reset() {
            board = Array(9).fill(""); // Clear the board
            Display.update(); 
        },
        getBoard() {
            return board; // Show the current state of the board
        },
        update(index, marker) {
            if (board[index] === "") { // If the spot is empty
                board[index] = marker; // Put the marker ('X' or 'O') there
                Display.update(); // Tell the Display to update
                return true; // The move was successful
            }
            // prevents unexpected things such as marking on already taken place
            return false; // The move was not allowed
        },
        getCellMarker(index) {
            return board[index]; // Show what’s in a specific spot
        }
    };
})();


// Game module
const Game = (() => {
    let currentMarker = 'X'; 

    function switchMarker() {
        currentMarker = currentMarker === 'X' ? 'O' : 'X'; // Change to the other marker
    }

    function checkWinner(board) {
        const patterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (const [a, b, c] of patterns) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // Who is the winner ('X' or 'O')
            } 
        }
        return null; // No winner yet
    }

    function checkTie(board) {
        return board.every(cell => cell !== ""); // Check if the board is full
    }

    function gameFlow(index) {
        const board = Gameboard.getBoard(); // Current board
        // if updating is sucessfull check winner function
        if (Gameboard.update(index, currentMarker)) { // Update board
            const winner = checkWinner(board); 
            // if winner is true show winner and if its false check for the tie
            // switch marker if there's no winner and if tiles are empty
            if (winner) {
                Display.showDialog(`${winner} wins!`); 
                currentMarker = 'X';
            } else if (checkTie(board)) {
                Display.showDialog("It's a tie!"); 
                currentMarker = 'X';
            } else {
                switchMarker(); 
                Display.updateMarkerDisplay(currentMarker); 
            }
        }
    }
    function resetGame() {
        Gameboard.reset();
        currentMarker = 'X'; // Ensure that 'X' is the first marker after reset
        Display.updateMarkerDisplay(currentMarker); 
    }

    return { gameFlow, resetGame};
})();


// Display module
const Display = (() => {
    const container = document.querySelector('.container'); 
    const dialog = document.getElementById('dialog'); 
    const dialogMessage = document.getElementById('dialog-message');
    const restartButton = document.getElementById('restart-button'); 
    const closeButton = document.getElementById('close-dialog'); 
    const markerX = document.getElementById('x-mark'); 
    const markerO = document.getElementById('o-mark'); 

    function update() {
        const cells = document.querySelectorAll('.cell'); // Get all board cells
        cells.forEach((cell, index) => {
            cell.textContent = Gameboard.getCellMarker(index); // Update cell with 'X' or 'O'
        });
    }

    function updateMarkerDisplay(marker) {
        markerX.classList.toggle('active', marker === 'X'); 
        markerO.classList.toggle('active', marker === 'O'); 
    }

    function showDialog(message) {
        dialogMessage.textContent = message; 
        dialog.style.display = 'flex'; // Make the dialog visible
    }

    function hideDialog() {
        dialog.style.display = 'none'; // Hide the dialog
    }

    function resetAll() {
        Game.resetGame(); 
        hideDialog(); 
    }

    function setupEventListeners() {
        container.addEventListener('click', (event) => {
            if (event.target.classList.contains('cell')) {
                const index = parseInt(event.target.dataset.index, 10); // Get the clicked cell index
                Game.gameFlow(index); // Handle the game flow
            }
        });

        restartButton.addEventListener('click', resetAll);
        closeButton.addEventListener('click', resetAll);
    }

    function init() {
        setupEventListeners(); 
        updateMarkerDisplay('X');
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div'); 
            cell.className = 'cell'; 
            cell.dataset.index = i; 
            container.appendChild(cell); // Add it to the board
        }
    }
    return { update, updateMarkerDisplay, showDialog, init };
})();

// Initialize the game
Display.init();
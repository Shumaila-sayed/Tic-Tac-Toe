// Gameboard module
const Gameboard = (() => {
    let board = Array(9).fill(""); // Create a board with 9 empty spaces

    return {
        reset() {
            board = Array(9).fill(""); // Clear the board
            Display.update(); // Tell the Display to update
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
            return false; // The move was not allowed
        },
        getCellMarker(index) {
            return board[index]; // Show what’s in a specific spot
        }
    };
})();


// Game module
const Game = (() => {
    let currentMarker = 'X'; // Start with 'X'

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
        const board = Gameboard.getBoard(); // Get the current board
        const validMove = Gameboard.update(index, currentMarker); // Try to make the move

        if (validMove) { // If the move was successful
            const winner = checkWinner(board); // Check if there's a winner
            if (winner) {
                Display.showDialog(`${winner} wins!`); // Show the winner
                return;
            }

            if (checkTie(board)) {
                Display.showDialog("It's a tie!"); // Show if it's a tie
                return;
            }

            switchMarker(); // Switch to the next player's turn
            Display.updateMarkerDisplay(currentMarker); // Update the display with the current marker
        }
    }

    return { gameFlow };
})();


// Display module
const Display = (() => {
    const container = document.querySelector('.container'); // The board area
    const dialog = document.getElementById('dialog'); // The dialog box
    const dialogMessage = document.getElementById('dialog-message'); // The message in the dialog
    const restartButton = document.getElementById('restart-button'); // Button to restart the game
    const closeButton = document.getElementById('close-dialog'); // Button to close the dialog
    const markerX = document.getElementById('x-mark'); // The 'X' marker display
    const markerO = document.getElementById('o-mark'); // The 'O' marker display

    function update() {
        const cells = document.querySelectorAll('.cell'); // Get all board cells
        cells.forEach((cell, index) => {
            cell.textContent = Gameboard.getCellMarker(index); // Update cell with 'X' or 'O'
        });
    }

    function updateMarkerDisplay(marker) {
        markerX.classList.toggle('active', marker === 'X'); // Highlight 'X'
        markerO.classList.toggle('active', marker === 'O'); // Highlight 'O'
    }

    function showDialog(message) {
        dialogMessage.textContent = message; // Show the message
        dialog.style.display = 'flex'; // Make the dialog visible
    }

    function hideDialog() {
        dialog.style.display = 'none'; // Hide the dialog
    }

    function setupEventListeners() {
        container.addEventListener('click', (event) => {
            if (event.target.classList.contains('cell')) {
                const index = parseInt(event.target.dataset.index, 10); // Get the clicked cell index
                Game.gameFlow(index); // Handle the game flow
            }
        });

        restartButton.addEventListener('click', () => {
            Gameboard.reset(); // Reset the game
            updateMarkerDisplay('X'); // Start with 'X'
            hideDialog(); // Hide the dialog
        });

        closeButton.addEventListener('click', () => {
            hideDialog(); // Just hide the dialog
            Gameboard.reset(); // Reset the game

        });
    }

    function init() {
        setupEventListeners(); // Set up event listeners for clicks
        updateMarkerDisplay('X'); // Start with 'X'
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div'); // Create a new cell
            cell.className = 'cell'; // Set its class
            cell.dataset.index = i; // Set its index
            container.appendChild(cell); // Add it to the board
        }
    }

    return { update, updateMarkerDisplay, showDialog, init };
})();

// Initialize the game
Display.init();
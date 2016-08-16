"use strict";

/**
 * Modal window for player to choose "X" or "O"
 * @type {Element}
 */
let modal = document.getElementById("choose-modal");

/**
 * "X" button from the modal window
 * @type {Element}
 */
let xBtn  = document.getElementsByClassName("btn-x")[0];

/**
 * "O" button from the modal window
 * @type {Element}
 */
let oBtn  = document.getElementsByClassName("btn-o")[0];

/**
 * Player's value ("X" or "O")
 * @type {String}
 */
let player = "";

/**
 * Enemy's value ("X" or "O")
 * @type {String}
 */
let enemy  = "";

/**
 * The HTML element references of each cell in the board
 * @type {Array}
 */
let cells = document.getElementsByClassName("cell");

/**
 * 2D representation of the board containing values "", "X", or "O"
 * @type {Array}
 */
let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];

/**
 * [playersTurn description]
 * @type {Boolean}
 */
let playersTurn = false;

/**
 * Firstly show the modal window
 */
modal.style.display = "block";

/**
 * Click handler if player is "X"
 */
xBtn.onclick = () => {
    modal.style.display = "none";
    player = "X";
    enemy = "O";
    initializeGame();
};

/**
 * Click handler if player is "O"
 */
oBtn.onclick = () => {
    modal.style.display = "none";
    player = "O";
    enemy = "X";
    initializeGame();
};

/**
 * Initialize the turn
 * If enemy plays first, a random cell will be assigned "X"
 */
function initializeGame() {
    // if enemy  === "X", enemy picks a cell first, and assign that random cell
    if (enemy === "X") {
        playersTurn = false;
        assignEnemyCell();
        switchTurn();
    }
    // else player picks a cell first
    else {
        playersTurn = true;
    }

    // assign click listener to each cell
    for (let i = 0; i < cells.length; i++) {
        cells[i].onclick = handlePlayerClick;
    }
}

/**
 * Assign a value to a cell of certain row and column (2D)
 * 
 * @param  {Number} i       i-th row
 * @param  {Number} j       j-th column
 * @param  {String} value   player or enemy's value
 */
function assignCell(i, j, value) {
    if (i === -1 || j === -1) {
        alert("ERROR: Cell not found!");
    }

    board[i][j] = value;
    let oneDimIndex = i * 3 + j;

    let text = "<h1>" + value + "</h1>";
    cells[oneDimIndex].innerHTML = text;
}

/**
 * To switch turn
 */
function switchTurn() {
    playersTurn = !playersTurn;
}

/**
 * Get the cell's index (1D or 2D) from cells[] array
 * @param  {Element} el                 The cell HTML element (a.cell)
 * @param  {Boolean} getTwoDimIndex     true: get its 2D index, false: 1D
 * @return {Array or Number}            The 1D/2D index
 */
function getCellIndex(el, getTwoDimIndex) {
    let notFound = (getTwoDimIndex) ? [-1, -1] : -1;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i] === el) 
            return (getTwoDimIndex) ? convertToTwoDimIndex(i) : i;
    }

    return notFound;
}

/**
 * Convert a 1D index to its 2D version (for board[][])
 * @param  {Number} oneDimIndex     1D index (0..8 or 9-1)
 * @return {Array}                  2D index, i.e. [i-th row, j-th column]
 */
function convertToTwoDimIndex(oneDimIndex) {
    return [Math.floor(oneDimIndex / 3), oneDimIndex % 3];
}

/**
 * Convert a 2D index to its 1D version (for cells[])
 * @param  {Number} i i-th row
 * @param  {Number} j j-th column
 * @return {Number}   the 1D index
 */
function convertToOneDimIndex(i, j) {
    return i * 3 + j;
}

/**
 * To show player's/enemy's win by highlighting the corresponding cells
 * @param  {Number} i           i-th row
 * @param  {Number} j           j-th column
 * @param  {[type]} playerWins  true: the player wins, false: the enemy wins
 */
function showWin(i, j, playerWins) {
    let className = (playerWins) ? "player-win" : "enemy-win";
    cells[convertToOneDimIndex(i, j)].classList.add(className);
}

/**
 * Stop showing player's/enemy's win, by removing the previous highlights
 * @param  {Number} i           i-th row
 * @param  {Number} j           j-th column
 * @param  {[type]} playerWins  true: the player wins, false: the enemy wins
 */
function hideWin(i, j, playerWins) {
    let className = (playerWins) ? "player-win" : "enemy-win";
    cells[convertToOneDimIndex(i, j)].classList.remove(className);  
}

/**
 * Show that the game is tie/draw, by highlighting all cells with .draw
 */
function showDraw() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.add("draw");
    }
}

/**
 * Remove the highlights from all cells which assigned the class .draw
 */
function hideDraw() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("draw");
    }
}

/**
 * To check whether an endgame (win/loss/draw) has been reached
 * @param {Boolean} animateCells    true: highlight the won/draw cells
 * @param {Boolean} checkPlayerWin  true: returns true/false based on user's win
 * @return {Boolean}                if endgame is reached, or else based on the
 *                                  conditions above
 */
function isEndgame(animateCells, checkPlayerWin) {
    // check for win horizontally
    for (let i = 0; i < board.length; i++) {
        if (board[i][0] === player && 
            board[i][1] === player && 
            board[i][2] === player) {
            
            /*alert("Player wins!");*/
            if (animateCells) {
                showWin(i, 0, true);
                showWin(i, 1, true);
                showWin(i, 2, true);
                window.setTimeout(() => {
                    hideWin(i, 0, true);
                    hideWin(i, 1, true);
                    hideWin(i, 2, true);
                }, 2000);
            }

            return true;
        }
        if (board[i][0] === enemy && 
            board[i][1] === enemy && 
            board[i][2] === enemy) {

            /*alert("Enemy wins!");*/
            if (animateCells) {
                showWin(i, 0, false);
                showWin(i, 1, false);
                showWin(i, 2, false);
                window.setTimeout(() => {
                    hideWin(i, 0, false);
                    hideWin(i, 1, false);
                    hideWin(i, 2, false);
                }, 2000);
            }

            return (checkPlayerWin) ? false : true;
        }
    }

    // check for win vertically
    for (let j = 0; j < board.length; j++) {
        if (board[0][j] === player &&
            board[1][j] === player &&
            board[2][j] === player) {

            /*alert("Player wins!");*/
            if (animateCells) {
                showWin(0, j, true);
                showWin(1, j, true);
                showWin(2, j, true);
                window.setTimeout(() => {
                    hideWin(0, j, true);
                    hideWin(1, j, true);
                    hideWin(2, j, true);
                }, 2000);
            }

            return true;
        }

        if (board[0][j] === enemy &&
            board[1][j] === enemy &&
            board[2][j] === enemy) {

            /*alert("Enemy wins!");*/
            if (animateCells) {
                showWin(0, j, false);
                showWin(1, j, false);
                showWin(2, j, false);
                window.setTimeout(() => {
                    hideWin(0, j, false);
                    hideWin(1, j, false);
                    hideWin(2, j, false);
                }, 2000);
            }

            return (checkPlayerWin) ? false : true;
        }
    }

    // check for win diagonally (left-top to right-bottom)
    if (board[0][0] === player && 
        board[1][1] === player &&
        board[2][2] === player) {

        /*alert("Player wins!");*/
        if (animateCells) {
            showWin(0, 0, true);
            showWin(1, 1, true);
            showWin(2, 2, true);
            window.setTimeout(() => {
                hideWin(0, 0, true);
                hideWin(1, 1, true);
                hideWin(2, 2, true);
            }, 2000);
        }

        return true;
    }

    if (board[0][0] === enemy && 
        board[1][1] === enemy &&
        board[2][2] === enemy) {

        /*alert("Enemy wins!");*/
        if (animateCells) {
            showWin(0, 0, false);
            showWin(1, 1, false);
            showWin(2, 2, false);
            window.setTimeout(() => {
                hideWin(0, 0, false);
                hideWin(1, 1, false);
                hideWin(2, 2, false);
            }, 2000);
        }

        return (checkPlayerWin) ? false : true;
    }   

    // check for win diagonally (right-top to left-bottom)
    if (board[0][2] === player && 
        board[1][1] === player &&
        board[2][0] === player) {

        /*alert("Player wins!");*/
        if (animateCells) {
            showWin(0, 2, true);
            showWin(1, 1, true);
            showWin(2, 0, true);
            window.setTimeout(() => {
                hideWin(0, 2, true);
                hideWin(1, 1, true);
                hideWin(2, 0, true);
            }, 2000);
        }

        return true;
    }

    if (board[0][2] === enemy && 
        board[1][1] === enemy &&
        board[2][0] === enemy) {

        /*alert("Enemy wins!");*/
        if (animateCells) {
            showWin(0, 2, false);
            showWin(1, 1, false);
            showWin(2, 0, false);
            window.setTimeout(() => {
                hideWin(0, 2, false);
                hideWin(1, 1, false);
                hideWin(2, 0, false);
            }, 2000);
        }

        return (checkPlayerWin) ? false : true;
    }

    // check for draw
    if (isDraw()) {
        if (animateCells) {
            showDraw();
            window.setTimeout(hideDraw, 2000);
        }

        return (checkPlayerWin) ? false : true;
    }

    // continue game if none of the conditions above are met
    return false;
}

/**
 * Check whether the game is draw
 * @return {Boolean} true: the game is draw, false otherwise
 */
function isDraw() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === "") return false;
        }
    }

    return true;
}

/**
 * Reset the game after the previous endgame
 */
function resetGame() {
    // remove all values from board[][]
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            board[i][j] = "";
        }
    }

    // reset all text from the cells
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "<h1></h1>";
    }
}

/**
 * Click handler: for player's turn to pick a cell
 */
function handlePlayerClick(event) {
    // find the corresponding cell & indices (both from cells[] and board[][])
    let cell = event.target.parentNode;
    let [i, j] = getCellIndex(cell, true);

    // assign the cell with player's value
    if (playersTurn && board[i][j] === "") { // if the cell is not empty, do nothing
        // assign that cell
        assignCell(i, j, player);

        // check whether an endgame has been reached
        if (isEndgame(true, false)) {
            window.setTimeout(resetGame, 2000);
            return true;
        }

        // switch turn (continue/restart playing)
        switchTurn();

        // assign enemy cell and switch turn
        assignEnemyCell();

        // switch turn (continue/restart playing)
        switchTurn();

        // check whether an endgame has been reached
        if (isEndgame(true, false)) {
            window.setTimeout(resetGame, 2000);
            return true;
        }
    }
}

/**
 * Enemy's turn to assign an empty cell
 */
function assignEnemyCell() {
    /*let i, j;*/

    /*// pick an empty cell randomly
    do {
        i = Math.floor(Math.random() * 3);
        j = Math.floor(Math.random() * 3);
    } while(board[i][j] !== "");*/

    /**
     * The desired move for the enemy/AI 
     * (also used to simulate player's moves in the minimax algorithm)
     * @type {Array}    [i-th row, j-th column]
     */
    let choice = [-1, -1];

    /**
     * Scoring function for minimax algorithm
     * @return {Number}     The score
     */
    let score = (depth) => {
        // stores boolean value of whether an endgame has been reached
        let isFinalGame = isEndgame(false, false);
        let playerWins = isEndgame(false, true);

        // if endgame has been reached
        if (isFinalGame) {
            if (playerWins) { // player wins
                return 10 - depth;
            } else if (!playerWins) { // enemy wins
                return depth - 10;
            }
        }

        // if game hasn't ended
        return 0;
    }

    /**
     * Get available moves from a given board state
     * @param  {Array} board    Current/temporary board state
     * @return {Array}          List of available moves
     */
    let getAvaiableMoves = (board) => {
        let moves = [];

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] === "") moves.push([i, j]);
            }
        }

        return moves;
    }

    /**
     * Get the score for the most strategic move by the enemy/AI
     * @param  {Array} board    Current board state
     * @param  {Number} depth   n-th step from the starting position
     * @return {Number}         The desired score
     */
    let minimax = (board, depth, enemyTurn) => {
        if (isEndgame(false, false)) return score(depth);

        depth += 1;
        let scores = [];
        let moves = [];

        let avaiableMoves = getAvaiableMoves(board);
        avaiableMoves.map((move) => {
            // assign tempBoard a possible move
            let [i, j] = move;
            let tempBoard = _.cloneDeep(board);
            tempBoard[i][j] = (enemyTurn) ? enemy : player;

            // assign tempBoard to append scores[] and moves[]
            scores.push(minimax(tempBoard, depth, !enemyTurn));
            moves.push(move);
        });

        if (enemyTurn) {
            let maxScore = Math.max(...scores);
            let maxScoreIndex = scores.indexOf(maxScore);

            choice = moves[maxScoreIndex];

            return maxScore;
        } else {
            let minScore = Math.min(...scores);
            let minScoreIndex = scores.indexOf(minScore);

            choice = moves[minScoreIndex];

            return minScore;
        }
    }

    // assign that cell enemy's value
    minimax(board, 0, true);
    let [i, j] = choice;
    assignCell(i, j, enemy);
}
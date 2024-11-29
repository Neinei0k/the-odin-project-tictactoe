let Game = (player1Name, player2Name) => {

let Gameboard = (emptyMarker) => {
    const boardSize = 3;
    const board = [];

    for (let i = 0; i < boardSize; ++i) {
        board.push([]);
        for (let j = 0; j < boardSize; ++j) {
            board[i].push(null);
        }
    }

    /*
    Is board full
    */
    let isFull = () => board.every( (row) => row.every( (cell) => cell !== null ) );

    /*
    Get winning player object or none if tie or no moves left available.
    */
    let getWinner = () => {
        let getRowWinner      = (r) => board[r].every( (x) => x === board[r][0] ) ? board[r][0] : null;
        let getColWinner      = (c) => board.every( (row)    => row[c] === board[0][c] ) ? board[0][c] : null;
        let getDiagWinner     = ()  => board.every( (row, r) => row[r] === board[0][0] ) ? board[0][0] : null;
        let getAntiDiagWinner = ()  => board.every( (row, r) => row[board.length - 1 - r] === board[0][board.length - 1] ) ? board[0][board.length - 1] : null;

        return board.reduce( (acc, row, idx) => acc || getRowWinner(idx), null) ||
               board.reduce( (acc, row, idx) => acc || getColWinner(idx), null) ||
               getDiagWinner() || getAntiDiagWinner();
    };

    /*
    Player makes a move in a given cell. Returns if move was successful.
    */
    let move = (row, col, player) => {
        if (board[row][col] === null) {
            board[row][col] = player;
            return true;
        }
        return false;
    };

    let getBoard = () => board.map( (row) => row.map( (cell) => cell ? cell : emptyMarker ) );

    let printBoard = () => {
        console.log(getBoard().map( (row) => '|' + row.join('') + '|' ).join('\n'));
    };

    return {isFull, getWinner, move, getBoard, printBoard};
};

let Player = (gameboard, marker, name) => {
    let move = (row, col) => gameboard.move(row, col, marker);
    let getMarker = () => marker;
    let getName = () => name;
    
    return {move, getMarker, getName};
};

let GameController = (player1Name, player2Name) => {
    let gameboard = Gameboard(" ");
    let player1 = Player(gameboard, "X", player1Name);
    let player2 = Player(gameboard, "O", player2Name);
    let currentPlayer = player1;
    let state = "MOVE";

    let move = (row, col) => {
        if (state === "WIN" || state === "TIE") {
            return;
        }
        
        if (!currentPlayer.move(row, col)) {
            console.log(`Player "${currentPlayer.getName()}" with marker "${currentPlayer.getMarker()}" cannot make a move row ${row} column ${col}.`);
            return;
        }
        
        gameboard.printBoard();
        if (gameboard.isFull()) {
            console.log("Tie!");
            state = "TIE";
            return;
        }
        
        let winner = gameboard.getWinner();
        if (winner) {
            console.log(`${currentPlayer.getName()} won!`);
            state = "WIN";
            return;
        }
        
        currentPlayer = currentPlayer == player1 ? player2 : player1;
        console.log(`Current player: ${currentPlayer.getName()}`);
        return;
    };
    
    let getBoard = () => gameboard.getBoard();
    let printBoard = () => gameboard.printBoard();
    let getCurrentPlayer = () => currentPlayer;
    let getState = () => { return {state, currentPlayer} };
    
    gameboard.printBoard();
    console.log(`Current player: ${currentPlayer.getName()}`);
    
    return {move, getBoard, getCurrentPlayer, getState};
};

return GameController(player1Name, player2Name);

};

let ScreenController = () => {
    let dialog = document.querySelector('#start-game-dialog');
    let boardDiv = document.querySelector('#board');
    let statusDiv = document.querySelector('#status');
    
    let game;
    
    let screenUpdate = () => {
        boardDiv.innerHTML = "";
        game.getBoard().forEach( (row, irow) => {
            let div = document.createElement('div');
            row.forEach( (cell, icell) => {
                let btn = document.createElement('button');
                btn.innerText = cell;
                btn.classList.add("cell");
                btn.dataset.row = String(irow);
                btn.dataset.col = String(icell);
                div.appendChild(btn);
            } );
            boardDiv.appendChild(div);
        } );
        
        let state = game.getState();
        
        switch (state.state) {
            case "TIE":
                statusDiv.innerText = "Tie!";
                break;
            case "WIN":
                statusDiv.innerText = `${state.currentPlayer.getName()} (${state.currentPlayer.getMarker()}) won!`;
                break;
            case "MOVE":
                statusDiv.innerText = `${state.currentPlayer.getName()}'s (${state.currentPlayer.getMarker()}) move!`;
                break;
        }
    };
    
    let restart = () => {
        dialog.showModal();
    };
    
    document.querySelector('#start-game').addEventListener("click", () => {
        let player1Name = document.querySelector('#player1Name').value;
        let player2Name = document.querySelector('#player2Name').value;
        dialog.close();
        
        game = Game(player1Name, player2Name);
        
        screenUpdate();
        document.querySelector('#restart-game').style.display = "inline";
    });
    
    document.querySelector('#restart-game').addEventListener("click", restart);
    
    boardDiv.addEventListener("click", (event) => {
        let row = event.target.dataset.row;
        let col = event.target.dataset.col;
        
        game.move(row, col);
        screenUpdate();
    } );
    
    restart();
};

ScreenController();

/*
console.log("Test tie");
let game = Game('p1', 'p2');
console.log(game.move(1,1));
console.log(game.move(1,0));
console.log(game.move(0,0));
console.log(game.move(2,2));
console.log(game.move(0,1));
console.log(game.move(0,2));
console.log(game.move(2,0));
console.log(game.move(2,1));
console.log(game.move(1,2));

console.log("Test p1 win column");
game = Game('p1', 'p2');
console.log(game.move(1,1));
console.log(game.move(1,0));
console.log(game.move(0,0));
console.log(game.move(2,2));
console.log(game.move(0,1));
console.log(game.move(0,2));
console.log(game.move(2,1));

console.log("Test p1 win row");
game = Game('p1', 'p2');
console.log(game.move(1,1));
console.log(game.move(1,0));
console.log(game.move(0,0));
console.log(game.move(2,2));
console.log(game.move(0,1));
console.log(game.move(2,1));
console.log(game.move(0,2));

console.log("Test p2 win diagonal");
game = Game('p1', 'p2');
console.log(game.move(1,0));
console.log(game.move(0,0));
console.log(game.move(0,1));
console.log(game.move(1,1));
console.log(game.move(2,0));
console.log(game.move(2,2));
console.log(game.move(2,2));

console.log("Test p1 win antidiagonal");
game = Game('p1', 'p2');
console.log(game.move(2,0));
console.log(game.move(0,0));
console.log(game.move(2,0));
console.log(game.move(1,1));
console.log(game.move(1,0));
console.log(game.move(0,2));
*/
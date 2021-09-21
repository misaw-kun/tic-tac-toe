/* 
#############tic-tac-toe##############
-> 2 players or player vs ai
-> let player choose a sign
-> allow player to mark spot on board 
!! prevent players from marking already occupied spot
-> define the winning conditions (rows, columns, diagonals)
-> show the restart game button (changing signs mid-game restarts game)
-> X always goes first, O goes next (choosing O will make AI choose X and make a move first)
-> adding difficulty levels ( higher difficulty = closer to best move ; lower difficulty = more randomized move)
*/

"use strict";

const Player = (sign) => {
    let _sign = sign;

    const getSign = () => _sign; 

    const setSign = (sign, active) => {
        _sign = sign; 
        const btn = document.querySelector(`.sign.${sign}`);  
        // console.log(btn);
        active ? btn.classList.add('active') : btn.classList.remove('active');
    }

    return {
        getSign,
        setSign
    }
}  

const gameBoard = (() => {
    let _board = [['', '', ''],
                  ['', '', ''],
                  ['', '', '']];

    const getField = (row, col) => {
        if( row > 3 && col > 3) return;
        return _board[row][col];
    }

    const getBoard = () => {
        return _board;
    }

    const setField = (row, col, sign) => {
        if( row > 3 && col > 3) return;
        _board[row][col] = sign;
    }

    const emptyIndexies = () => {

        let emptySpots = [];

        for(let r = 0; r < 3; r++) {
            for(let c = 0; c < 3; c++) {
                    if( _board[r][c] === '')
                        emptySpots.push({index: {i: r, j: c}});
                }
            }
            return emptySpots;    

        }

    const changeSign = (sign) => {
        if (sign == 'x') {
            displayController.humanPlayer.setSign('x', true);
            displayController.aiPlayer.setSign('o');
        }
        else if (sign == 'o') {
            displayController.humanPlayer.setSign('o', true);
            displayController.aiPlayer.setSign('x');
        }
        else throw 'Incorrect sign';
    }

    const resetBoard = () => {
        for(let r = 0; r < 3; r++) {
            for(let c = 0; c < 3; c++) {
                _board[r][c] = '';
            }
        }
    }

    return {
        getField,
        setField,
        emptyIndexies,
        resetBoard,
        getBoard,
        changeSign
    }

})()

const gameController = (() => {
    let isOver = false;
    let winner = null;

    const equalsThree = (a, b, c) => {
        return a == b && b == c && a != '';
    }

    const getIsOver = () => {
        return isOver
    }

    const setIsOver = (newIsOver) => {
        isOver = newIsOver;
    }

    const getWinner = () => {
        return winner;
    }

    const _checkRows = (board) => {
        for(let i = 0; i < 3; i++) {
            if(equalsThree(board.getField(i,0),board.getField(i,1),board.getField(i,2))){
                winner = board.getField(i, 0);
                return true; 
            }
        }
        return false;
    }

    const _checkCols = (board) => {
        for(let j = 0; j < 3; j++) {
            if(equalsThree(board.getField(0, j), board.getField(1, j), board.getField(2, j))){
                winner = board.getField(0, j);
                return true;
            }
        }
        return false;
    }

    const _checkDiags = (board) => {
        if(equalsThree(board.getField(0, 0), board.getField(1, 1), board.getField(2, 2)) 
            || 
            equalsThree(board.getField(0, 2), board.getField(1, 1), board.getField(2, 0)) ){
                winner = board.getField(1, 1);
                return true;
            }
        return false;
    }

    const checkForWin = (board) => {
        if(_checkRows(board) || _checkCols(board) || _checkDiags(board)){
            return true;
        }

        return false;
    }

    const checkForDraw = (board) => {
        if( checkForWin(board) )
            return false;

        for (let i = 0; i<3; i++){
            for (let j = 0; j<3; j++){
                if (gameBoard.getField(i, j) == '') 
                    return false;
            }
        }

        return true;
    }

    const restartGame = () => {
        setIsOver(false);
        displayController.setMessageElement('');
        gameBoard.resetBoard();
        displayController.updateGameBoard();

        //if human goes for 2nd turn, switch ai to move first

        if(displayController.humanPlayer.getSign() == 'o') {
            displayController.switchCurrentPlayer(displayController.aiPlayer);
            displayController.aiStep();
        }
    }

    return {
        checkForWin,
        setIsOver,
        getIsOver,
        getWinner,
        checkForDraw,
        restartGame
    }

})()

const aiLogic = ((perc) => {

    let aiPrecision = perc

    const setAiDifficulty = (perc) => {
        aiPrecision = perc;
    }

    const _findBestMove = (moves, player) => {
        let bestMove;
        if (player === displayController.aiPlayer.getSign()) {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
        return moves[bestMove];

    }

        const minimax = (newBoard, depth, player) => {

                if (gameController.checkForDraw(newBoard)) {
                    return {
                        score: 0
                    };
                }
                else if (gameController.checkForWin(newBoard)) {

                    if (player == displayController.humanPlayer.getSign()) {
                        return {
                            score: 10 - depth
                        };
                    }
                    else if (player == displayController.aiPlayer.getSign()) {
                        return {
                            score: -10 + depth
                        };
                    }
                }

                let moves = [];

                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {

                        let move = {};

                        if(newBoard.getField(i, j) == ''){
                            move.index = { i, j };
                            newBoard.setField(i, j, player) ;

                        
                        //Call the minimax with the opposite player
                        if (player == displayController.aiPlayer.getSign()) {
                            let result = minimax(newBoard, depth + 1, displayController.humanPlayer.getSign());
                            move.score = result.score;
                        }
                        else {
                            let result = minimax(newBoard, depth + 1, displayController.aiPlayer.getSign());
                            move.score = result.score;
                        }

                        //Reset the filed value set before
                        newBoard.setField(i, j, '');

                        moves.push(move);
                    }
                }
            }
            // console.log(moves);
            //find the best move
            return _findBestMove(moves, player);
        }

        const chooseField = () => {

            let choice = null;
            const randomValue = Math.floor(Math.random() * (100 + 1)) //between 1 and 100

            if( randomValue <= aiPrecision ) {
                choice = minimax(gameBoard, 0, displayController.aiPlayer.getSign());
                if(choice.index == undefined) return;
                let square = gameBoard.getField(choice.index.i, choice.index.j);
                if( square != '')
                    throw 'spot occupied'
            } else {
                const emptySpots = gameBoard.emptyIndexies();
                // console.log(emptySpots);
                let randomMove = Math.floor(Math.random() * gameBoard.emptyIndexies().length);
                choice = emptySpots[randomMove];
            }

            return choice;
        }

        return {
            chooseField,
            setAiDifficulty
        }

})()

const displayController = (() => {
    const squares = document.querySelectorAll('[data-row][data-column]');
    const message = document.getElementById('message');
    const x = document.querySelector('.x');
    const o = document.querySelector('.o');
    const easy = document.querySelector('.easy');
    const med = document.querySelector('.med');
    const hard = document.querySelector('.hard');
    const over9k = document.querySelector('.ai');
    const restartBtn = document.querySelector('.restart');

    let humanPlayer = Player('x');
    let aiPlayer = Player('o');
    let current_player = humanPlayer;


    const setResultMessage = (winner) => {
        winner === 'tie' ? displayController.setMessageElement('tie') : displayController.setMessageElement(`Player ${winner} has won !!!`);
    }

    const changePlayerSign = (sign) => {
        gameBoard.changeSign(sign);
        updateGameBoard();
        gameController.restartGame();
    }


    const setMessageElement = (msg) => {
        message.textContent = msg;   
    }

    const updateGameBoard = () => {
        for(let r = 0; r < 3; r++) {
            for(let c = 0; c < 3; c++) {
                document.querySelector(`[data-row='${r}'][data-column='${c}']`).textContent = gameBoard.getField(r, c);
            }
        }
    }

    const aiStep = () => {

        let choice = aiLogic.chooseField();
        // console.log(choice);
        if(choice == undefined) return;
        gameBoard.setField(choice.index.i, choice.index.j, current_player.getSign());
        // console.log(current_player.getSign());
        updateGameBoard();

        if(gameController.checkForDraw(gameBoard)){
            gameController.setIsOver(true);
            setResultMessage('tie');
        }

        if(gameController.checkForWin(gameBoard)){
            gameController.setIsOver(true);
            setResultMessage(gameController.getWinner());
        }

        switchCurrentPlayer(humanPlayer);
    }

    const playerStep = (row, col) => {
        gameBoard.setField(row, col, current_player.getSign());
        updateGameBoard();

        if(gameController.checkForDraw(gameBoard)){
            gameController.setIsOver(true);
            setResultMessage('tie');
        }

        if(gameController.checkForWin(gameBoard)){
            gameController.setIsOver(true);
            setResultMessage(gameController.getWinner());
        }

        switchCurrentPlayer(aiPlayer);
    }

    const switchCurrentPlayer = (player) => {
        current_player = player;
    }

    const _switchDifficulty = (value, level) => {
        const msg = document.getElementById('level');  
        // console.log(msg);
    
        if(level == 'easy' || level == 'medium' || level == 'hard' || level == 'over9k')
            msg.textContent = level;

        aiLogic.setAiDifficulty(value);
        gameController.restartGame();   
    }

    const _init = (() => {

        squares.forEach(square => 
            square.onclick = (e) => {

                if( gameController.getIsOver() || e.target.textContent !== '') return;

                let row = e.target.dataset.row;
                let col = e.target.dataset.column;

                playerStep(row, col)
                // console.log(gameBoard);
                setTimeout(() => aiStep(), 500);
                // console.log(gameController.checkForWin(gameBoard));
                // console.log(gameController.checkForDraw(gameBoard));
            }
        );

        x.onclick = () => changePlayerSign('x');
        o.onclick = () => changePlayerSign('o');

        easy.onclick = (e) => _switchDifficulty('0', e.target.textContent);
        med.onclick = (e) => _switchDifficulty('75', e.target.textContent);
        hard.onclick = (e) => _switchDifficulty('90', e.target.textContent);
        over9k.onclick = (e) => _switchDifficulty('100', e.target.textContent);

        restartBtn.onclick = () => gameController.restartGame();

    })()

    return {
        humanPlayer,
        aiPlayer,
        aiStep,
        setMessageElement,
        changePlayerSign,
        updateGameBoard,
        switchCurrentPlayer
    }
})()

//keeping x button active initially (starting off with x as human)
displayController.changePlayerSign('x');

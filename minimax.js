let scores = {
    x: 1,
    o: -1,
    tie: 0
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (gameBoard.getField(i, j) == '') {

            //moving ai to that spot
            gameBoard.setField(i, j, aiPlayer.getSign()); 
            let score = minimax(gameBoard.getBoard(), 0 , false);

            console.log(score);
            //undo the move 
            gameBoard.setField(i, j, ''); 

            if (score > bestScore) {
              bestScore = score;
              move = { i, j };
            }
          }
        }
      }
      
      gameBoard.setField(move.i, move.j, aiPlayer.getSign()); 
      current_player = humanPlayer;
}

function minimax(board, depth, isMaximizing) {
    let result = gameController.checkWinner();
    // console.log(result);
    if( result !== null ) {
        return  scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

          if (gameBoard.getField(i, j) == '') {
            gameBoard.setField(i, j, aiPlayer.getSign()); 

            let score = minimax(board, depth + 1, false);

            gameBoard.setField(i, j, ''); 
            bestScore = Math.max(score, bestScore);
          }
        }
      }

      return bestScore;

    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

          if (gameBoard.getField(i, j) == '') {
            gameBoard.setField(i, j, humanPlayer.getSign()); 

            let score = minimax(board, depth + 1, true);

            gameBoard.setField(i, j, ''); 
            bestScore = Math.min(score, bestScore);
          }
        }
      }

      return bestScore;
}

const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  let wins = 0;

  return { getName, getMarker };
};

const gameBoard = (() => {
  const boardState = ["", "", "", "", "", "", "", "", ""];
  let boardCells = [];
  boardCells = document.querySelectorAll(".cell");

  const getBoardState = () => boardState;

  const updateBoardState = (index, value) => {
    boardState[index] = value;
    displayController.updateDisplay(index, value);
  };

  const setupBoard = (cellFunction) => {
    boardCells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        console.log(e.target.id);
        cellFunction(e.target.id, "X");
      });
    });
    console.log(boardCells);
  };

  return { updateBoardState, getBoardState, setupBoard };
})();

const displayController = (() => {
  const boardDisplay = document.querySelectorAll(".cell");

  const updateDisplay = (cellNumber, value) => {
    boardDisplay[cellNumber].innerHTML = value;
  };

  return { updateDisplay };
})();

const gameController = (() => {
  const playerOne = Player("Player 1", "X");
  const playerTwo = Player("Player 2", "O");
  let activePlayer = playerOne;

  const playRound = (id) => {
    gameBoard.updateBoardState(id, activePlayer.getMarker());

    if (activePlayer === playerOne) {
      activePlayer = playerTwo;
    } else {
      activePlayer = playerOne;
    }
  };

  const startGame = () => {
    // create player 1
    // create player 2
    gameBoard.setupBoard(playRound);
  };

  return { startGame };
})();

gameController.startGame();

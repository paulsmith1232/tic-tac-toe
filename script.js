const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;

  return { getName, getMarker };
};

const Cell = () => {
  let marker = "";
  let index = null;

  const addMarker = (playerMarker) => {
    marker = playerMarker;
  };

  const addIndex = (indexNumber) => {
    index = indexNumber;
  };

  const getMarker = () => marker;
  const getIndex = () => index;
  return { addMarker, getMarker, addIndex, getIndex };
};

const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const cells = rows * columns;
  let board = [];

  const getBoard = () => board;

  const addBoardMark = (index, player) => {
    const cell = board[index];
    if (cell.getMarker() === "") {
      cell.addMarker(player);
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = [];
    for (let i = 0; i < cells; i++) {
      board.push(Cell());
    }
  };

  // creates array representing state of game board
  resetBoard();

  return { getBoard, addBoardMark, resetBoard };
})();

const displayController = (() => {
  const boardContainer = document.querySelector(".game-board");
  const gameMessageContainer = document.querySelector(".game-message");
  const resetButton = document.querySelector(".reset-button");
  const endGameContainer = document.querySelector(".end-game-container");
  const endGameMessage = document.querySelector(".end-game-message");

  const updateDisplay = () => {
    const board = gameBoard.getBoard();
    const activePlayer = gameController.getActivePlayer();

    boardContainer.textContent = "";
    updateGameMessage(`${activePlayer.getName()}'s turn...`);

    board.forEach((cell, index) => {
      const cellButton = document.createElement("button");
      cellButton.classList.add("cell");

      // add column  and row identifiers as data attributes
      cellButton.dataset.cellNumber = index;
      cell.addIndex(index);
      cellButton.textContent = cell.getMarker();
      boardContainer.appendChild(cellButton);
    });
  };

  const updateGameMessage = (string) => {
    gameMessageContainer.textContent = string;
  };

  const clickHandlerBoard = (e) => {
    const selectedNumber = e.target.dataset.cellNumber;
    if (!selectedNumber) return;

    gameController.playRound(selectedNumber);
  };

  const showEndGame = (string) => {
    endGameMessage.innerHTML = string;
    endGameContainer.classList.add("open");
  };
  const hideEndGame = () => {
    endGameContainer.classList.remove("open");
  };

  const disableClicks = () => {
    boardContainer.removeEventListener("click", clickHandlerBoard);
  };

  const enableClicks = () => {
    boardContainer.addEventListener("click", clickHandlerBoard);
  };

  const attachResetFunction = (func) => {
    resetButton.addEventListener("click", func);
    endGameContainer.addEventListener("click", func);
  };

  enableClicks();

  return {
    updateDisplay,
    updateGameMessage,
    disableClicks,
    enableClicks,
    showEndGame,
    hideEndGame,
    attachResetFunction,
  };
})();

const gameController = (() => {
  const playerOne = Player("Player 1", "X");
  const playerTwo = Player("Player 2", "O");
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let activePlayer = playerOne;
  let endState = false;

  const switchActivePlayer = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (cellIndex) => {
    const validPlay = gameBoard.addBoardMark(
      cellIndex,
      getActivePlayer().getMarker()
    );
    if (validPlay) {
      displayController.updateDisplay();
      endState = winCheck();
      if (endState) {
        endGame();
      } else {
        switchActivePlayer();
      }
    }
  };

  const winCheck = () => {
    const board = gameBoard.getBoard();
    const marker = activePlayer.getMarker();
    let markedCells = [];
    let victory = false;

    // define a function for comparing win conditions against marked cells
    const checker = (arr, target) => target.every((v) => arr.includes(v));

    // builds an array containing the occupied cells that match the
    // active player's marker
    markedCells = board
      .filter((cell) => cell.getMarker() === marker)
      .map((cell) => cell.getIndex());

    winConditions.forEach((row) => {
      if (checker(markedCells, row)) {
        victory = true;
      }
    });
    return victory;
  };

  const endGame = () => {
    displayController.disableClicks();
    displayController.showEndGame(`${activePlayer.getName()} wins!`);
  };

  const resetGame = () => {
    activePlayer = playerOne;
    gameBoard.resetBoard();
    displayController.enableClicks();
    displayController.hideEndGame();
    displayController.updateDisplay();
  };

  displayController.attachResetFunction(resetGame);

  return { playRound, getActivePlayer, resetGame };
})();

displayController.updateDisplay();

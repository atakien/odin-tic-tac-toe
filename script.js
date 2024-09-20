const DisplayController = (() => {
  const renderMessage = (message) => {
    document.querySelector("#message").innerText = message;
  };

  return {
    renderMessage,
  };
})();

const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const render = (nextMark) => {
    const boardHTML = gameboard.map((square, index) => 
      `<div class="cell ${square === 'X' ? 'x-mark' : square === 'O' ? 'o-mark' : ''}" 
           id="square-${index}" 
           data-mark="${nextMark}">
           ${square}
       </div>`
    ).join('');
    
    document.querySelector("#gameboard").innerHTML = boardHTML;
    const squares = document.querySelectorAll(".cell");
    squares.forEach((square) => {
      square.addEventListener("click", Game.handleClick);
    });
  };

  const update = (index, value) => {
    gameboard[index] = value;
    render();
  };

  const getGameboard = () => gameboard;

  const reset = () => {
    gameboard.fill("");
    render();
  };

  return {
    render,
    update,
    getGameboard,
    reset,
  };
})();

const createPlayer = (name, mark) => {
  return {
    name,
    mark
  };
};

const Game = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const start = () => {
    const player1Name = document.querySelector("#player1").value.trim() || "Player X";
    const player2Name = document.querySelector("#player2").value.trim() || "Player O";
    
    players = [
      createPlayer(player1Name, "X"),
      createPlayer(player2Name, "O")
    ];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.render(players[currentPlayerIndex].mark); 
    DisplayController.renderMessage(`${players[currentPlayerIndex].name}'s turn!`);
  };

  const handleClick = (event) => {
    if (gameOver) return;

    const index = parseInt(event.target.id.split("-")[1]);
    
    if (Gameboard.getGameboard()[index] !== "") return;

    Gameboard.update(index, players[currentPlayerIndex].mark);
    
    if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
      gameOver = true;
      DisplayController.renderMessage(`${players[currentPlayerIndex].name} wins!`);
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      DisplayController.renderMessage("It's a tie!");
    } else {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      Gameboard.render(players[currentPlayerIndex].mark); 
      DisplayController.renderMessage(`${players[currentPlayerIndex].name}'s turn!`);
    }
  };

  const restart = () => {
    Gameboard.reset();
    gameOver = false;
    DisplayController.renderMessage("");

    document.querySelector("#player1").value = "";
    document.querySelector("#player2").value = "";
  };

  return {
    start,
    handleClick,
    restart,
  };
})();

function checkForWin(board, mark) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some(([a, b, c]) => 
    board[a] === mark && board[b] === mark && board[c] === mark
  );
}

function checkForTie(board) {
  return board.every(cell => cell !== "");
}

document.querySelector("#restart-button").addEventListener("click", Game.restart);
document.querySelector("#start-button").addEventListener("click", Game.start);

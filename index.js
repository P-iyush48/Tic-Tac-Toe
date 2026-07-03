let player;
const choosePlayer = document.querySelector(".choose-player");
const overlay = document.querySelector(".overlay");
const gameBoard = document.querySelector(".game-board");
const xWinPara = document.querySelector(".x-win");
const oWinPara = document.querySelector(".o-win");
const drawPara = document.querySelector(".draw");
const resetGameButton = document.querySelector(".reset");
// [[0,2],[1,0],[1,2],[2,0],[2,2]]
// [0,2]
// row = 0
// colum = 2

// Initalizing array in which game will be stored
let game = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let currPlayer = "X";
// Choose player event listerner
choosePlayer.addEventListener("click", (e) => {
  const value = e.target.dataset.value;
  if (value) {
    player = value;
    overlay.style.display = "none";
  }
});

// main game logic
gameBoard.addEventListener("click", (e) => {
  // console.log(e.target);
  let index = e.target.dataset.index;
  if (index) {
    index = index.split(""); // "00" ==> ["0","0"]
    let row = parseInt(index[0]); // 0
    let column = parseInt(index[1]); // 0
    if (game[row][column] == "") {
      game[row][column] = currPlayer;
      e.target.innerText = currPlayer;
      currPlayer = currPlayer == "X" ? "O" : "X";
      let winner = checkWin(game);
      if (winner) {
        setTimeout(() => {
          alert(`${winner} Player Wins`);
          let currScoreX = parseInt(xWinPara.innerText);
          let currScoreO = parseInt(oWinPara.innerText);
          if (winner == "X") {
            currScoreX++;
          } else {
            currScoreO++;
          }
          xWinPara.innerText = currScoreX;
          oWinPara.innerText = currScoreO;
          resetGame();
        }, 300);
      }

      let draw = checkDraw();
      if (draw) {
        setTimeout(() => {
          alert(`It's a Draw`);
          let currScoreDraw = parseInt(drawPara.innerText);
          currScoreDraw++;
          drawPara.innerText = currScoreDraw;
          resetGame();
        }, 300);
      }

      if (player == "computer") {
        setTimeout(() => {
          let [row, column] = chooseAiMove();
          game[row][column] = currPlayer;
          for (let cell of gameBoard.children) {
            if (cell.dataset.index == row + "" + column) {
              cell.innerText = currPlayer;
              currPlayer = currPlayer == "X" ? "O" : "X";
            }
          }

          let winner = checkWin(game);
          if (winner) {
            setTimeout(() => {
              alert(`${winner} Player Wins`);
              let currScoreX = parseInt(xWinPara.innerText);
              let currScoreO = parseInt(oWinPara.innerText);
              if (winner == "X") {
                currScoreX++;
              } else {
                currScoreO++;
              }
              xWinPara.innerText = currScoreX;
              oWinPara.innerText = currScoreO;
              resetGame();
            }, 300);
          }

          let draw = checkDraw();
          if (draw) {
            setTimeout(() => {
              alert(`It's a Draw`);
              let currScoreDraw = parseInt(drawPara.innerText);
              currScoreDraw++;
              drawPara.innerText = currScoreDraw;
              resetGame();
            }, 300);
          }
        }, 100);
      }
    }
  }
});

// reset game button click logic
resetGameButton.addEventListener("click", () => {
  resetGame();
  xWinPara.innerText = "0";
  oWinPara.innerText = "0";
  drawPara.innerText = "0";
});

// function that will return which player has win returns undefined if no one is win till now
function checkWin(game) {
  // checking for row win
  for (let row of game) {
    if (row[0] != "" && row[0] == row[1] && row[1] == row[2]) {
      return row[0];
    }
  }

  // checking for column win
  for (let column = 0; column < game.length; column++) {
    if (
      game[0][column] != "" &&
      game[0][column] == game[1][column] &&
      game[1][column] == game[2][column]
    ) {
      return game[0][column];
    }
  }

  // checking for left diagonal
  if (
    game[0][0] != "" &&
    game[0][0] == game[1][1] &&
    game[1][1] == game[2][2]
  ) {
    return game[0][0];
  }

  // checking for right diagonal
  if (
    game[0][2] != "" &&
    game[0][2] == game[1][1] &&
    game[1][1] == game[2][0]
  ) {
    return game[0][2];
  }
}

// function that will reset the game
function resetGame() {
  game = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currPlayer = "X";
  const allCells = gameBoard.children;
  for (let cell of allCells) {
    cell.innerText = "";
  }
}

//function to check draw
function checkDraw() {
  let isDraw = true;
  for (let row = 0; row < game.length; row++) {
    for (let column = 0; column < game.length; column++) {
      if (game[row][column] == "") {
        isDraw = false;
        break;
      }
    }
  }
  return isDraw;
}

function findEmptyCells(game) {
  let ans = [];
  for (let row = 0; row < game.length; row++) {
    for (let column = 0; column < game.length; column++) {
      if (game[row][column] == "") {
        ans.push([row, column]);
      }
    }
  }
  return ans;
}

function generateRandomInt(min, max) {
  return parseInt(Math.random() * (max - min + 1)) + min;
}

function chooseAiMove() {
  let allEmptyBlocks = findEmptyCells(game);
  let computer = currPlayer;
  let player = computer == "X" ? "O" : "X";
  // checking for all possible moves and returning that which can lead computer to win
  for (let currPossibleMove of allEmptyBlocks) {
    let row = currPossibleMove[0];
    let column = currPossibleMove[1];
    game[row][column] = computer;
    let winner = checkWin(game);
    if (winner) {
      return [row, column];
    }
    game[row][column] = "";
  }

  // checking for all possible moves and returning if any move is blocking player wining.
  for (let currPossibleMove of allEmptyBlocks) {
    let [row, column] = currPossibleMove;
    game[row][column] = player;
    let winner = checkWin(game);
    if (winner) {
      return [row, column];
    }
    game[row][column] = "";
  }

  // making random move
  let move = generateRandomInt(0, allEmptyBlocks.length - 1);
  return allEmptyBlocks[move];
}

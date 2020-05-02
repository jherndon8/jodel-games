var turn = 0;
var width = 15;
var height = 15;
var gameOver = false;
var board = Array(width * height);

function announceWinner(winner) {
  console.log("a");
  if (winner == 0) {
    window.alert("X wins");
  }
  if (winner == 1) {
    window.alert("O wins");
  }
  if (winner == 2) {
    window.alert("Board filled");
  }
}

function checkWinner() {
  var filled = true;
  for (var i = 0; i < board.length; i++) {
    if (board[i] == undefined) filled = false;
    if (board[i] !== undefined) {
      if (
        (board[i] == board[i + 1] &&
          board[i + 1] == board[i + 2] &&
          board[i + 2] == board[i + 3] &&
          board[i + 3] == board[i + 4]) ||
        (board[i] == board[i + width] &&
          board[i + width] == board[i + 2 * width] &&
          board[i + 2 * width] == board[i + 3 * width] &&
          board[i + 3 * width] == board[i + 4 * width]) ||
        (board[i] == board[i + 1 + width] &&
          board[i + 1 + width] == board[i + 2 + 2 * width] &&
          board[i + 2 + 2 * width] == board[i + 3 + 3 * width] &&
          board[i + 3 + 3 * width] == board[i + 4 + 4 * width]) ||
        (board[i] == board[i - 1 + width] &&
          board[i - 1 + width] == board[i - 2 + 2 * width] &&
          board[i - 2 + 2 * width] == board[i - 3 + 3 * width] &&
          board[i - 3 + 3 * width] == board[i - 4 + 4 * width])
      ) {
        gameOver = true;
        announceWinner(board[i]);
      }
    }
  }
  if (filled) {
    announceWinner(2);
  }
}

function tileClick(row, tile) {
  var clicked = document.getElementById("board").children[row+1].children[tile];
  if (clicked.innerHTML || gameOver) return;
  board[tile + row * width] = turn;
  if (turn) {
    clicked.innerHTML = "o";
    clicked.style.color = "red";
    turn = 0;
  } else {
    clicked.innerHTML = "x";
    clicked.style.color = "blue";
    turn = 1;
  }
  checkWinner();
  document.getElementById('status').innerHTML="It's " + "xo".charAt(turn) + "'s turn"
}

//generate board and listen to click event
var domBoard = document.createElement("table");
domBoard.id = "board";

var header = document.createElement("tr");
var c = document.createElement("th");
header.appendChild(c);
for (let i = 0; i < width; i++) {
    c = document.createElement("th");
    c.innerHTML = String.fromCharCode(65+i)
    header.appendChild(c);
}
domBoard.appendChild(header);
for (let i = 0; i < height; i++) {
  var row = document.createElement("tr");
  row.innerHTML += i + 1;
  for (let j = 0; j < width; j++) {
    var tile = document.createElement("td");
    //tile.onclick = function() {
    //  tileClick(i, j);
    //};
    row.appendChild(tile);
  }
  domBoard.appendChild(row);
}
function boardMove(comment) {
  var c = comment.charCodeAt(0) - 65;
  var r = comment.substring(1) - 1;
  if (r >=0 && r < height && c >= 0 && c < width) {
      tileClick(r, c);
  }
}
function isBoardMove(comment) {
  var c = comment.charCodeAt(0) - 65;
  var r = comment.substring(1) - 1;
  return r >=0 && r < height && c >= 0 && c < width;
}
document.getElementById("game").appendChild(domBoard);

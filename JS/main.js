'use strict'
const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gTimerIntervalId
var gBoard
var gTimeStart = false
var gLevel = {
  SIZE: 4,
  MINES: 2
}

var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0
}

function onInit() {
  // This is called when page loads
  gGame.isOn = true;

  gBoard = buildBoard(gLevel.SIZE)
  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
  resetTimer()

}
function buildBoard(size) {
  // Builds the board Set the mines Call setMinesNegsCount() Return the created board

  const board = []
  for (var i = 0; i < size; i++) {
    board[i] = []
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
      }
    }
  }
  // board[1][1].isMine = true
  // board[0][0].isMine = true

  mineRandom(board)

  return board
}

function mineRandom(board) {
  var minesToPut = 0
  while (minesToPut < gLevel.MINES) {
    var rowIdx = getRandomInt(0, gLevel.SIZE)
    var colIdx = getRandomInt(0, gLevel.SIZE)
    var currCell = board[rowIdx][colIdx]
    if (currCell.isMine === false) {
      currCell.isMine = true
      minesToPut++
    }
  }
}

function renderBoard(board) {
  // Render the board as a <table> to the page

  var strHTML = ''

  for (var i = 0; i < board.length; i++) {

    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {

      const cell = board[i][j]
      var content = ''

      if (cell.isShown === false) {
        if (cell.isMine) {
          content = MINE
        } else if (cell.minesAroundCount > 0)
          content = cell.minesAroundCount
      }

      strHTML += `<td class="cell hidden" 
                  data-i="${i}" data-j="${j}"
                  onclick="onCellClicked(this)"
                  oncontextmenu="onCellMarked(event, this)"> ${content}</td>`
    }
    strHTML += `</tr>`;
  }
  const elCells = document.querySelector('.mineSweeper-cells')
  // console.log(elCells)
  elCells.innerHTML = strHTML;
}

function setMinesNegsCount(gBoard) {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (!gBoard[i][j].isMine) {
        gBoard[i][j].minesAroundCount = countMinesAround(gBoard, i, j)
      }
    }
  }
}

function countMinesAround(board, rowIdx, colIdx) {
  // Count mines around each cell and set the cell's minesAroundCount.
  var mineCount = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue
      if (j < 0 || j >= board[0].length) continue
      var currCell = board[i][j]

      if (currCell.isMine) {
        mineCount++
      }
    }

  }
  return mineCount
}

function onCellClicked(elBtn) {
  if (!gGame.isOn) return
  if (gTimeStart === false) startTimer()

  const i = +elBtn.dataset.i
  const j = +elBtn.dataset.j

  const cell = gBoard[i][j]
  if (cell.isShown || cell.isMarked) return

  if (cell.isShown === false) {
    cell.isShown = true
    gGame.shownCount++
    elBtn.classList.remove('hidden')

    if (cell.isMine) {
      elBtn.classList.remove('hidden')
      cell.isShown = true

      stopTimer()
      gGame.isOn = false
      alert('You lose... 😥')
    }
  }
  checkGameOver()
}

function onCellMarked(event, elBtn) {
  //Called when a cell is right- clicked --See how you can hide the context
  // menu on right click--
  if (!gGame.isOn) return

  event.preventDefault()
  const i = +elBtn.dataset.i
  const j = +elBtn.dataset.j
  const cell = gBoard[i][j]
  cell.isMarked = !cell.isMarked
  if (cell.isShown) {
    return
  }

  if (cell.isMarked) {
    elBtn.innerHTML = FLAG;
    elBtn.classList.toggle('hidden')
  } else {
    elBtn.innerHTML = '';
    elBtn.classList.toggle('hidden')
  }
}

function checkGameOver() {
  // Game ends when all mines are marked, and all the other cells are shown

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var currCell = gBoard[i][j]
      if ((currCell.isMine && currCell.isShown) || (!currCell.isMine && !currCell.isShown)) {
        return false
      }
    }
  }
  gGame.isOn = false
  stopTimer()
  alert('You won!🏆')
  return
}

function expandShown(board, elCell, i, j) {
  // When user clicks a cell with no mines around,
  // we need to open not only that cell, but also its neighbors.
  // NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function gameLevel(level) {
  const elCells = document.querySelector('.mineSweeper-cells')
  elCells.innerText = ''
  if (level === 'Easy') {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    onInit()
  }

  if (level === 'Medium') {
    gLevel.SIZE = 8
    gLevel.MINES = 14

    onInit()
  }
  else if (level === 'Hard') {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    onInit()
  }
}

function startTimer() {
  gTimeStart = true
  var start = Date.now();
  gTimerIntervalId = setInterval(function () {
    var delta = Date.now() - start;
    const timer = document.querySelector('.timer')
    timer.innerText = `${(delta / 1000)}`
  }, 100);

}

function stopTimer() {
  clearInterval(gTimerIntervalId);
  gTimeStart = false; // Assuming you want to stop the time tracking
}

function resetTimer() {
  const timer = document.querySelector('.timer')
  timer.innerText = '0'
}

function onClickEmoji() {
  stopTimer()
  onInit()
}
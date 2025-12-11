const board = document.getElementById('game-board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const resultScreen = document.getElementById('result-screen');
const resultMessage = document.getElementById('result-message');
const newGameBtn = document.getElementById('new-game');

let currentPlayer = 'X';
let gameActive = true;
let cells = ['', '', '', '', '', '', '', '', ''];

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.innerHTML = '<span></span>';
    board.appendChild(cell);
  }
}

function handleClick(e) {
  const clickedCell = e.target.closest('.cell');
  const index = clickedCell.dataset.index;
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;
  clickedCell.innerHTML = `<span>${currentPlayer}</span>`;

  if (checkWin()) {
    gameActive = false;
    showResultScreen(`🎉 Player ${currentPlayer} Wins!`);
  } else if (!cells.includes('')) {
    gameActive = false;
    showResultScreen(`🤝 It's a Draw!`);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWin() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return winPatterns.some(([a,b,c]) => {
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function showResultScreen(message) {
  resultMessage.textContent = message;
  resultScreen.style.display = 'flex';
}

function resetGame() {
  cells = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  resultScreen.style.display = 'none';
  createBoard();
}

// Initial setup
board.addEventListener('click', handleClick);
resetBtn.addEventListener('click', resetGame);
newGameBtn.addEventListener('click', resetGame);
createBoard();

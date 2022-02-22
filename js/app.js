const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const canvasScore = document.getElementById('score');
const contextScore = canvasScore.getContext('2d');

const canvasReport = document.getElementById('report');
const contextReport = canvasReport.getContext('2d');

const canvasGameOver = document.getElementById('game-over');
const contextGameOver = canvasGameOver.getContext('2d');


let grid = 16;

let count = 0;

let score = 0;

let record = 0;

let level = 1;

let rAF = requestAnimationFrame(loop);

let gameOver = false;

let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

let apple = {
  x: getRandomInt(0, 25) * grid,
  y: getRandomInt(0, 25) * grid
};

let Storage_size = localStorage.length;

if (Storage_size > 0) {
  record = localStorage.record;
}


let blinkCount = 1000;

function blinkText(text) {
  
  blinkCount--;

  if (blinkCount % 2 === 1) {

    contextReport.globalAlpha = 1;
    contextReport.fillStyle = 'white';
    contextReport.font = '15px Courier New';
    contextReport.textAlign = 'center';
    contextReport.fillText(text, canvasReport.width / 2, canvasReport.height / 2)
  }
  else {
    contextReport.clearRect(0,0,canvasReport.width, canvasReport.height)
  }
}



function getRandomInt(min, max) {

  return Math.floor(Math.random() * (max - min)) + min;
}


function showGameOver() {
  
  cancelAnimationFrame(rAF);

  gameOver = true;

  contextGameOver.fillStyle = 'black';
  contextGameOver.globalAlpha = 1;
  contextGameOver.fillRect(0, canvasGameOver.height / 2 - 30, canvasGameOver.width, 60);
  contextGameOver.globalAlpha = 1;
  contextGameOver.fillStyle = 'white';
  contextGameOver.font = '36px monospace';
  contextGameOver.textAlign = 'center';
  contextGameOver.textBaseline = 'middle';
  contextGameOver.fillText('GAME OVER!', canvasGameOver.width / 2, canvasGameOver.height / 2);
}

function showScore() {
  contextScore.clearRect(0,0,canvasScore.width, canvasScore.height)
  contextScore.globalAlpha = 1;
  contextScore.fillStyle = 'white';
  contextScore.justifyContent = 'space-between';
  contextScore.font = '16px Courier New';
  contextScore.fillText('Score:   ' + score, 1, 35)
  contextScore.fillText('Record:  ' + record, 155, 35)
  contextScore.fillText('Level:   ' + level, 303, 35);
}


function loop() {

  showScore();
  rAF =  requestAnimationFrame(loop);

  if (++count < 4) {
    return;
  }

  count = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;



  if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {

    
    showGameOver();
    setInterval(function () {
      blinkText('PRESS space TO RESTART')
    }, 600);


    score = 0;
    level = 1;

  }
  
  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
  
  context.fillStyle = 'green';
  snake.cells.forEach( function(cell, index) {

    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    if (cell.x === apple.x && cell.y === apple.y) {
      
      snake.maxCells++;
      score += 10;
      level = Math.floor(score / 100) + 1;

      if (score > record) {

        record = score;
        localStorage.record = record;

        let newRecord = setInterval(function () {
          blinkText('NEW RECORD!')
        }, 1000);
        
        setTimeout(() => {clearTimeout(newRecord)}, 5000)
      }

      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    for (let i = index + 1; i < snake.cells.length; i++) {

      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {

        showGameOver();
        setInterval(function () {
          blinkText('PRESS space TO RESTART')
        }, 600);
      }
    }
  });
}


document.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft' && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.code === 'ArrowUp' && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.code === 'ArrowRight' && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.code === 'ArrowDown' && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  } 

  if (e.code === 'Space' && gameOver === true) {
    document.location.reload();
  }
});



const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

const gridSize = 20;
const tileSize = canvas.width / gridSize;
let snake, food, dx, dy, score, gameLoop;

document.addEventListener('keydown', changeDirection);
upButton.addEventListener('click', () => changeDirection({ keyCode: 38 }));
downButton.addEventListener('click', () => changeDirection({ keyCode: 40 }));
leftButton.addEventListener('click', () => changeDirection({ keyCode: 37 }));
rightButton.addEventListener('click', () => changeDirection({ keyCode: 39 }));

function main() {
    resetGame();
    gameLoop = setInterval(() => {
        if (gameOver()) {
            alert('Game Over');
            clearInterval(gameLoop);
            return;
        }
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        updateScore();
    }, 100);
}

function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];  // Snake starts with a length of 3
    food = { x: 15, y: 15 };
    dx = 1;
    dy = 0;
    score = 0;
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 1000; // Increase score by 1000 points
        createFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };

    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            createFood();
        }
    });
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function gameOver() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= gridSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= gridSize;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

main();

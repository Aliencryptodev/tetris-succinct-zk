let canvas = document.getElementById('tetris');
let context = canvas.getContext('2d');
context.scale(20, 20);

let playerName = "YOU";
let gameOver = false;
let finalScore = 0;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function createMatrix(w, h) {
    const matrix = [];
    while (h--) matrix.push(new Array(w).fill(0));
    return matrix;
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function update(time = 0) {
    if (gameOver) return;
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        dropCounter = 0;
    }
    draw();
    requestAnimationFrame(update);
}

function startGame() {
    playerName = prompt("Enter your Twitter handle (without @):", "player") || "YOU";
    canvas.style.display = 'block';
    document.getElementById('startGame').disabled = true;
    gameOver = false;
    draw();
    update();
}

document.getElementById('startGame').addEventListener('click', startGame);
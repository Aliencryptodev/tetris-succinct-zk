
// tetris.js
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

context.scale(canvas.width / 12, canvas.height / 20);

let gameOver = false;
let finalScore = 0;
let playerName = "YOU";

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        if (arena[y].every(cell => cell !== 0)) {
            arena.splice(y, 1);
            arena.unshift(new Array(12).fill(0));
            player.score += 100 * rowCount;
            rowCount *= 2;
            createParticles(canvas.width / 2 / (canvas.width / 12), canvas.height / 2 / (canvas.height / 20), '#FE11C5');
            playLineClearSound();
        }
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) matrix.push(new Array(w).fill(0));
    return matrix;
}

function createPiece(type) {
    if (type === 'T') return [[0,0,0],[1,1,1],[0,1,0]];
    if (type === 'O') return [[2,2],[2,2]];
    if (type === 'L') return [[0,3,0],[0,3,0],[0,3,3]];
    if (type === 'J') return [[0,4,0],[0,4,0],[4,4,0]];
    if (type === 'I') return [[0,5,0,0],[0,5,0,0],[0,5,0,0],[0,5,0,0]];
    if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
    if (type === 'Z') return [[7,7,0],[0,7,7],[0,0,0]];
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const gradient = context.createLinearGradient(
                    x + offset.x, y + offset.y, 
                    x + offset.x + 1, y + offset.y + 1
                );
                gradient.addColorStop(0, colors[value]);
                gradient.addColorStop(1, 'white');

                context.fillStyle = gradient;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);

                context.strokeStyle = 'rgba(0,0,0,0.2)';
                context.lineWidth = 0.05;
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x:0, y:0});
    drawMatrix(player.matrix, player.pos);
    updateParticles(context);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        if (player.pos.y <= 0) {
            gameOver = true;
            finalScore = player.score;
            playGameOverSound();  // Ensure it's called immediately
            arena.forEach(row => row.fill(0));
            saveScore();
            updateLeaderboard();
            updateScore();
            pauseMusic();
            document.getElementById('startGame').disabled = false;
            setTimeout(() => {
                showGameOver();
                showShareButton(finalScore);
            }, 300);
            return;
        }
        merge(arena, player);
        arenaSweep();
        playerReset();
        updateScore();
    }
    dropCounter = 0;
}

function startGame() {
    playerName = prompt("Enter your Twitter handle (without @):", "player") || "YOU";
    canvas.style.display = 'block';
    document.getElementById('startGame').disabled = true;
    const existingShareButton = document.getElementById('shareButton');
    if (existingShareButton) existingShareButton.remove();

    gameOver = false;
    arena.forEach(row => row.fill(0));
    player.score = 0;
    playMusic();
    playerReset();
    update();
}

const colors = [null,'#FF00CC','#FFE600','#FF7B00','#0099FF','#00FF99','#FF3366','#9900FF'];
const arena = createMatrix(12, 20);
const player = { pos: {x:0, y:0}, matrix: null, score: 0 };

canvas.style.display = 'none';

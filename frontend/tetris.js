
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

let gameOver = false; // 🔥 Nueva variable global

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        if (arena[y].every(cell => cell !== 0)) {
            arena.splice(y, 1);
            arena.unshift(new Array(12).fill(0));
            player.score += 100;
            rowCount *= 2;
            createParticles(canvas.width / 2 / 20, canvas.height / 2 / 20, '#FE11C5');
            playLineClearSound();
        }
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] &&
                 arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'T') return [[0,0,0],[1,1,1],[0,1,0]];
    else if (type === 'O') return [[2,2],[2,2]];
    else if (type === 'L') return [[0,3,0],[0,3,0],[0,3,3]];
    else if (type === 'J') return [[0,4,0],[0,4,0],[4,4,0]];
    else if (type === 'I') return [[0,5,0,0],[0,5,0,0],[0,5,0,0],[0,5,0,0]];
    else if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
    else if (type === 'Z') return [[7,7,0],[0,7,7],[0,0,0]];
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
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
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    // Game Over detection
    if (collide(arena, player)) {
        gameOver = true; // 🔥 Activar Game Over

        arena.forEach(row => row.fill(0));  // Limpiar el tablero
        saveScore();  // Guardar puntaje
        updateLeaderboard();  // Actualizar leaderboard
        player.score = 0;  // Resetear puntaje
        updateScore();  // Mostrar puntaje actualizado

        setTimeout(() => {
            context.fillStyle = '#FE11C5';
            context.font = '2rem Poppins';
            context.fillText('GAME OVER', canvas.width / 2 - 70, canvas.height / 2);  // Mostrar Game Over
        }, 100);

        pauseMusic();  // Pausar música

        // Habilitar botón de inicio nuevamente
        document.getElementById('startGame').disabled = false;
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) matrix.forEach(row => row.reverse());
    else matrix.reverse();
}

let dropCounter = 0;
let dropInterval = 500;
let lastTime = 0;

function update(time = 0) {
    if (gameOver) {
        return;  // 🔥 Detener actualización si el juego terminó
    }

    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('scoreTable').querySelector('tbody').innerHTML =
        <tr><td>YOU</td><td>${player.score}</td></tr>;
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        playerMove(1);
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        playerDrop();
    } else if (event.key === 'ArrowUp' || event.key === 'w') {
        playerRotate(1);
    }
});

const colors = [null, '#FE11C5', '#781961', '#FF66CC', '#CC00FF', '#FF99FF', '#FF33FF', '#FF00CC'];
const arena = createMatrix(12, 20);
const player = { pos: {x:0, y:0}, matrix: null, score: 0 };

canvas.style.display = 'none';

function saveScore() {
    let scores = JSON.parse(localStorage.getItem('topScores')) || [];
    scores.push(player.score);
    scores = scores.sort((a, b) => b - a).slice(0, 5);
    localStorage.setItem('topScores', JSON.stringify(scores));
}

function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('topScores')) || [];
    const leaderboardTable = document.getElementById('scoreTable').querySelector('tbody');
    leaderboardTable.innerHTML = '';
    leaderboard.forEach((score, index) => {
        const row = leaderboardTable.insertRow();
        row.insertCell(0).textContent = Player ${index + 1};
        row.insertCell(1).textContent = score;
    });
}

document.getElementById('startGame').addEventListener('click', () => {
    canvas.style.display = 'block';
    document.getElementById('startGame').disabled = true;
    playMusic();
    playerReset();
    update();
});


const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Ajuste de escala dinámico
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
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
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
            arena.forEach(row => row.fill(0));
            saveScore();
            updateLeaderboard();
            updateScore();
            pauseMusic();
            document.getElementById('startGame').disabled = false;

            setTimeout(() => {
                showGameOver();
                showShareButton(finalScore);
            }, 100);
            return;
        }
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerReset() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        gameOver = true;
        finalScore = player.score;
        arena.forEach(row => row.fill(0));
        saveScore();
        updateLeaderboard();
        updateScore();
        pauseMusic();
        document.getElementById('startGame').disabled = false;

        setTimeout(() => {
            showGameOver();
            showShareButton(finalScore);
        }, 100);
    }
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
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
    if (gameOver) return;
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
    const tbody = document.getElementById('scoreTable')?.querySelector('tbody');
    if (!tbody) return;
    if (gameOver) {
        tbody.innerHTML = `<tr><td>${playerName}</td><td>${finalScore}</td></tr>`;
    } else {
        tbody.innerHTML = `<tr><td>${playerName}</td><td>${player.score}</td></tr>`;
    }
}

function saveScore() {
    let scores = JSON.parse(localStorage.getItem('topScores')) || [];
    scores.push({ name: playerName, score: player.score });
    scores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
    localStorage.setItem('topScores', JSON.stringify(scores));
}

function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('topScores')) || [];
    const leaderboardTable = document.getElementById('scoreTable')?.querySelector('tbody');
    if (!leaderboardTable) return;
    leaderboardTable.innerHTML = '';

    const sorted = leaderboard
        .filter(entry => entry && entry.score !== undefined && entry.score !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    sorted.forEach((entry, index) => {
        const row = leaderboardTable.insertRow();
        row.insertCell(0).textContent = `#${index + 1}`;
        row.insertCell(1).textContent = entry.name || "Player";
        row.insertCell(2).textContent = entry.score;
    });
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

function showGameOver() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://raw.githubusercontent.com/Aliencryptodev/tetris-succinct-zk/main/assets/gameover_resized.png';

    img.onload = () => {
        canvas.style.display = 'block';
        context.setTransform(1, 0, 0, 1, 0, 0); // Elimina el escalado anterior
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height); // Imagen a pantalla completa

        setTimeout(() => {
            showShareButton(finalScore);
        }, 500);

        // Vuelve a aplicar la escala para el resto del juego
        context.scale(canvas.width / 12, canvas.height / 20);
    };

    img.onerror = () => {
        console.error("Error al cargar la imagen de Game Over");
    };
}

function showShareButton(score) {
    const existingButton = document.getElementById('shareButton');
    if (existingButton) {
        existingButton.remove();
    }

    const shareButton = document.createElement('button');
    shareButton.id = 'shareButton';
    shareButton.innerText = 'Share on Twitter 🐦';
    shareButton.style.backgroundColor = '#1DA1F2';
    shareButton.style.color = 'white';
    shareButton.style.border = 'none';
    shareButton.style.padding = '10px 20px';
    shareButton.style.fontSize = '1rem';
    shareButton.style.borderRadius = '10px';
    shareButton.style.cursor = 'pointer';
    shareButton.style.marginTop = '20px';
    shareButton.style.display = 'block';
    shareButton.style.marginLeft = 'auto';
    shareButton.style.marginRight = 'auto';
    shareButton.style.zIndex = '9999';
    shareButton.style.position = 'absolute';
    shareButton.style.bottom = '40px';
    shareButton.style.left = 'calc(50% - 80px)';
    shareButton.style.transform = 'none';

    shareButton.onclick = () => {
        const tweet = `🎮 I scored ${score} points in Tetris Succinct zkProof! 🌸 Created by @doctordr1on. Try to beat me! https://tetris-succinct-zk.vercel.app`;
        const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
        window.open(twitterURL, '_blank');
    };

    document.querySelector('.browser-content').appendChild(shareButton);
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

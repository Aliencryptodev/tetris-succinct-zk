
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

let gameOver = false;
let finalScore = 0;

const colors = [null, '#FE11C5', '#781961', '#FF66CC', '#CC00FF', '#FF99FF', '#FF33FF', '#FF00CC'];
const arena = createMatrix(12, 20);
const player = { pos: {x:0, y:0}, matrix: null, score: 0, linesCleared: 0, level: 0, name: '' };

let dropCounter = 0;
let dropInterval = 500;
let lastTime = 0;

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

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function arenaSweep() {
    let rowCount = 0;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        if (arena[y].every(cell => cell !== 0)) {
            arena.splice(y, 1);
            arena.unshift(new Array(12).fill(0));
            rowCount++;
            createParticles(canvas.width / 2 / 20, (y + 0.5), '#FE11C5');
            playLineClearSound();
        }
    }
    if (rowCount > 0) {
        player.score += rowCount * 100;
        player.linesCleared += rowCount;

        if (player.linesCleared >= 10) {
            player.level++;
            player.linesCleared -= 10;
            dropInterval = Math.max(100, dropInterval - 50); // Velocidad creciente
        }
    }
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

        setTimeout(() => {
            showGameOver();
            showShareButton(finalScore);
        }, 100);
    }
}

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
    const tbody = document.getElementById('scoreTable').querySelector('tbody');
    tbody.innerHTML = `<tr><td>${player.name || 'YOU'}</td><td>${player.score}</td></tr>`;

    const levelDisplay = document.getElementById('levelDisplay');
    if (levelDisplay) {
        levelDisplay.textContent = `Level: ${player.level}`;
    }
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

canvas.style.display = 'none';

function saveScore() {
    let scores = JSON.parse(localStorage.getItem('topScores')) || [];
    scores.push({name: player.name || 'YOU', score: player.score});
    scores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
    localStorage.setItem('topScores', JSON.stringify(scores));
}

function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('topScores')) || [];
    const leaderboardTable = document.getElementById('scoreTable').querySelector('tbody');
    leaderboardTable.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const row = leaderboardTable.insertRow();
        row.insertCell(0).textContent = `${entry.name}`;
        row.insertCell(1).textContent = entry.score;
    });
}

document.getElementById('startGame').addEventListener('click', () => {
    player.name = prompt('Enter your Twitter username (without @):') || 'YOU';
    player.linesCleared = 0;
    player.level = 0;
    dropInterval = 500;

    canvas.style.display = 'block';
    document.getElementById('startGame').disabled = true;

    const existingShareButton = document.getElementById('shareButton');
    if (existingShareButton) existingShareButton.remove();

    context.clearRect(0, 0, canvas.width, canvas.height);
    gameOver = false;
    arena.forEach(row => row.fill(0));
    player.score = 0;
    playMusic();
    playerReset();
    update();
});

function showGameOver() {
    const img = new Image();
    img.src = 'https://raw.githubusercontent.com/Aliencryptodev/tetris-succinct-zk/main/assets/gameover_resized.png';
    img.onload = () => {
        context.drawImage(img, (canvas.width / 2) - 120, (canvas.height / 2) - 60, 240, 120);
    };
}

function showShareButton(score) {
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

    shareButton.onclick = () => {
        const tweet = `🎮 I scored ${score} points in Tetris Succinct zkProof! 🌸 Created by @${player.name}. Try to beat me! https://tetris-succinct-zk.vercel.app`;
        const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
        window.open(twitterURL, '_blank');
    };

    document.querySelector('.game-container').appendChild(shareButton);
}







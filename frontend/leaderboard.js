// leaderboard.js - Sistema simple de Leaderboard

const leaderboard = [];

export function updateLeaderboard(playerName, score) {
    leaderboard.push({ playerName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 5) leaderboard.length = 5;
    renderLeaderboard();
}

function renderLeaderboard() {
    const table = document.getElementById('scoreTable').querySelector('tbody');
    table.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}. ${entry.playerName}</td><td>${entry.score}</td>`;
        table.appendChild(row);
    });
}

// Inicializamos con datos ficticios
updateLeaderboard('Player1', 300);
updateLeaderboard('Player2', 250);
updateLeaderboard('Player3', 200);
updateLeaderboard('Player4', 150);
updateLeaderboard('Player5', 100);

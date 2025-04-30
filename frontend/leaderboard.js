// leaderboard.js - Sistema de Leaderboard Top 5 🏆

function loadLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('topScores')) || [];
    return scores.sort((a, b) => b - a).slice(0, 5);
}

function saveScore(playerScore) {
    let scores = JSON.parse(localStorage.getItem('topScores')) || [];
    scores.push(playerScore);
    scores = scores.sort((a, b) => b - a).slice(0, 5);
    localStorage.setItem('topScores', JSON.stringify(scores));
}

function renderLeaderboard() {
    const leaderboard = loadLeaderboard();
    const tableBody = document.getElementById('scoreTable').querySelector('tbody');
    tableBody.innerHTML = '';

    leaderboard.forEach((score, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>Player ${index + 1}</td><td>${score}</td>`;
        tableBody.appendChild(row);
    });
}

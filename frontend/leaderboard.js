
// leaderboard.js - Gestionar el Top 5 ✅

function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('topScores')) || [];
    const leaderboardTable = document.getElementById('scoreTable').getElementsByTagName('tbody')[0];
    leaderboardTable.innerHTML = '';

    leaderboard.forEach((score, index) => {
        const row = leaderboardTable.insertRow();
        row.insertCell(0).textContent = `Player ${index + 1}`;
        row.insertCell(1).textContent = score;
    });
}

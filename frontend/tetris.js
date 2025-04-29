
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

let finalScore = 0;
let playerName = "YOU";

function showGameOver() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const imgElement = document.getElementById('gameOverImage');
    imgElement.style.display = 'block';
    setTimeout(() => {
        showShareButton(finalScore);
    }, 500);
}

function startGame() {
    playerName = prompt("Enter your Twitter handle (without @):", "player") || "YOU";
    canvas.style.display = 'block';
    document.getElementById('startGame').disabled = true;
    const existingShareButton = document.getElementById('shareButton');
    if (existingShareButton) existingShareButton.remove();
    document.getElementById('gameOverImage').style.display = 'none';
    // Resto de la lógica...
}

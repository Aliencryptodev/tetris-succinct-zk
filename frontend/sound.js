
// sound.js
const music = new Audio('https://raw.githubusercontent.com/Aliencryptodev/tetris-succinct-zk/main/assets/music.mp3');
music.preload = "auto";
music.loop = true;
music.volume = 0.5;

const clearSound = new Audio('https://raw.githubusercontent.com/Aliencryptodev/tetris-succinct-zk/main/assets/rompefila.mp3');
clearSound.volume = 0.7;

const gameOverSound = new Audio('https://raw.githubusercontent.com/Aliencryptodev/tetris-succinct-zk/main/assets/Gameover.mp3');
gameOverSound.volume = 0.8;

// Verificar si el navegador permite la reproducción
function canPlayMusic() {
    return music.readyState >= 2;
}

function playMusic() {
    if (canPlayMusic()) {
        music.currentTime = 0;
        music.play().catch(e => console.log('Error al reproducir la música:', e));
    }
}

function pauseMusic() {
    music.pause();
}

function playLineClearSound() {
    clearSound.currentTime = 0;
    clearSound.play().catch(err => console.warn('No se pudo reproducir rompefila:', err));
}

function playGameOverSound() {
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch(err => console.warn('No se pudo reproducir gameover:', err));
}

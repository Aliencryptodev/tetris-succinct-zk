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

// Función para iniciar la música
function playMusic() {
    if (canPlayMusic()) {
        music.currentTime = 0;
        music.play().catch(e => {
            console.log('Error al reproducir la música:', e);
        });
    } else {
        console.log('No se puede reproducir música ahora.');
    }
}

// Función para pausar la música
function pauseMusic() {
    music.pause();
}

// Reproducir sonido al romper una fila
function playLineClearSound() {
    clearSound.currentTime = 0;
    clearSound.play().catch(err => console.warn('No se pudo reproducir rompefila:', err));
}

// Reproducir sonido en Game Over
function playGameOverSound() {
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch(err => console.warn('No se pudo reproducir gameover:', err));
}


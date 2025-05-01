// sound.js
const music = new Audio('https://raw.githubusercontent.com/Aliencryptodev/tetris-succinct-zk/main/assets/music.mp3');
music.preload = "auto";  // Precargar la música
music.loop = true;
music.volume = 0.5;

// Verificar si el navegador permite la reproducción
function canPlayMusic() {
    if (music.readyState >= 2) {
        return true;
    } else {
        console.log("Música no cargada correctamente");
        return false;
    }
}

// Función para iniciar la música
function playMusic() {
    if (canPlayMusic()) {
        music.currentTime = 0; // Reiniciar la música
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
    const clearSound = new Audio('https://raw.githubusercontent.com/Aliencryptodev/tetris-succinct-zk/main/assets/rompefila.mp3');
    clearSound.volume = 0.7;
    clearSound.play().catch(err => console.warn('No se pudo reproducir rompefila:', err));
}

// Reproducir sonido en Game Over
function playGameOverSound() {
    const gameOverSound = new Audio('https://raw.githubusercontent.com/Aliencryptodev/tetris-succinct-zk/main/assets/Gameover.mp3');
    gameOverSound.volume = 0.8;
    gameOverSound.play().catch(err => console.warn('No se pudo reproducir gameover:', err));
}


// sound.js - Manejador simple de música para Tetris

const music = new Audio('music.mp3'); // Reemplazar con la ruta real si es diferente
music.loop = true;
music.volume = 0.5;

// Función para iniciar la música (por ejemplo, al empezar el juego)
function startMusic() {
    music.play();
}

// Función para pausar la música (opcional)
function pauseMusic() {
    music.pause();
}

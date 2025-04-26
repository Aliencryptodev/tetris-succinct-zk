// sound.js - Final Arcade Retro 🎶

const music = new Audio('assets/music.mp3');
music.loop = true;
music.volume = 0.5; // volumen moderado

const lineClearSound = new Audio('assets/line-clear.mp3');
lineClearSound.volume = 0.7; // un poco más fuerte para sentir el efecto

// Función para iniciar música de fondo
function playMusic() {
    music.currentTime = 0;
    music.play().catch(e => console.log('Error reproduciendo música:', e));
}

// Función para sonido de limpiar fila
function playLineClearSound() {
    lineClearSound.currentTime = 0;
    lineClearSound.play().catch(e => console.log('Error reproduciendo sonido de línea:', e));
}

// Opcional: Función para pausar música (por si quieres detenerla más adelante)
function pauseMusic() {
    music.pause();
}

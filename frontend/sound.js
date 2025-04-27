// sound.js
const music = new Audio('assets/music.mp3');
music.preload = "auto";  // Precargar la música
music.loop = true;
music.volume = 0.5;

function playMusic() {
    music.currentTime = 0;
    music.play().catch(e => console.log('Error al reproducir la música:', e));
}

function pauseMusic() {
    music.pause();
}

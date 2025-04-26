
const music = new Audio('assets/music.mp3');
music.loop = true;
music.volume = 0.5;

function startMusic() {
    music.play();
}

function pauseMusic() {
    music.pause();
}

// Opcional: Iniciar música al conectar wallet o iniciar juego
// startMusic();

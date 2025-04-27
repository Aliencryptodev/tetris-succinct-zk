// sound.js
const music = new Audio('https://raw.githubusercontent.com/Aliencryptodev/tetris-succinct-zk/main/assets/assets/music.mp3');
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

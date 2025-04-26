// sound.js - Versión FINAL 🎶

const music = new Audio('assets/music.mp3');
music.preload = "auto";  // <--- MUY IMPORTANTE
music.loop = true;
music.volume = 0.5;

function playMusic() {
    music.currentTime = 0;
    music.play()
      .then(() => console.log('🎶 Música iniciada correctamente'))
      .catch(err => console.log('⚠️ Error reproduciendo música:', err));
}

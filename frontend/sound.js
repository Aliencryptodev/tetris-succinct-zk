// sound.js - Música retro arcade 🎶

const music = new Audio('assets/music.mp3');
music.loop = true;
music.volume = 0.5;

function startMusic() {
    music.play();
}

function pauseMusic() {
    music.pause();
}


// tetris.js - corregido para partículas al eliminar filas

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        if (arena[y].every(cell => cell !== 0)) {
            arena.splice(y, 1);
            arena.unshift(new Array(12).fill(0));
            player.score += 100;
            rowCount *= 2;

            createParticles(canvas.width / 2 / 20, canvas.height / 2 / 20, '#FE11C5'); // 💥 Partículas!
        }
    }
}

// ... (el resto del archivo permanece igual)

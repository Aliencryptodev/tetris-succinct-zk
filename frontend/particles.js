
// particles.js - Sistema de partículas rosadas explosivas 💥

const particles = [];

function createParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            alpha: 1,
            color: color
        });
    }
}

function updateParticles(context) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
        }

        context.globalAlpha = p.alpha;
        context.fillStyle = p.color;
        context.fillRect(p.x, p.y, 0.2, 0.2);
        context.globalAlpha = 1.0;
    }
}

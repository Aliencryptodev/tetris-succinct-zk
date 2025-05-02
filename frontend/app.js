
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.7.0/+esm';

const contractAddress = '0x0782D0d995C13D3000F797aA25b5E0399AE7f051';
const abi = [ 
    "function submitGame(bytes proof, bytes publicInputs, uint256 score) external",
    "function getGame(address player) view returns (tuple(address player, uint256 score, bytes proof))",
];

let contract, provider, signer;

document.addEventListener('DOMContentLoaded', async () => {
    const submitButton = document.getElementById('submit');

    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
    } else {
        alert('Por favor instala MetaMask.');
        return;
    }

    if (submitButton) {
        submitButton.onclick = async () => {
            try {
                // 1. Datos del juego (reemplaza por valores reales del juego)
                const score = window.finalScore || 100;
                const name = window.playerName || 'YOU';
                const duration = window.gameDuration || 42;

                // 2. Solicita al backend que genere la prueba con SP1
                const response = await fetch('https://TU_VPS/generate-proof', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, score, duration })
                });

                const { proof, publicInputs } = await response.json();

                // 3. Enviar transacción a la blockchain
                const tx = await contract.submitGame(proof, publicInputs, score, {
                    gasLimit: 3000000
                });
                await tx.wait();

                alert('✅ Proof submitted and verified!');
                loadScores();
            } catch (err) {
                console.error("Error:", err);
                alert('❌ Error al enviar la transacción.');
            }
        };
    } else {
        console.error('El botón Submit no se encontró en el DOM.');
    }
});

async function loadScores() {
    try {
        const player = await signer.getAddress();
        const game = await contract.getGame(player);
        const table = document.getElementById('scoreTable').querySelector('tbody');
        table.innerHTML = `<tr><td>${game.player}</td><td>${game.score}</td></tr>`;
    } catch (err) {
        console.error("Error al cargar las puntuaciones:", err);
    }
}


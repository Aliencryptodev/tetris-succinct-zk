
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.7.0/+esm';

const contractAddress = '0x0782D0d995C13D3000F797aA25b5E0399AE7f051';
const abi = [ 
    "function submitGame(bytes proof, bytes publicInputs, uint256 score) external",
    "function getGame(address player) view returns (tuple(address player, uint256 score, bytes proof))",
];

// Configuración de tu wallet
const privateKey = 'TU_PRIVATE_KEY'; // Reemplaza con tu clave privada
const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/TU_INFURA_PROJECT_ID");
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, signer);

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit');
    if (submitButton) {
        submitButton.onclick = async () => {
            const dummyProof = '0x00'; // Cambia por un proof real
            const dummyPublicInputs = '0x00'; // Cambia por inputs reales
            const dummyScore = 100; // Usa un score válido

            try {
                console.log("Enviando transacción...");
                const tx = await contract.submitGame(dummyProof, dummyPublicInputs, dummyScore, {
                    gasLimit: 3000000 // Ajusta según sea necesario
                });
                await tx.wait();
                alert('Proof Submitted and Verified! 🚀');
                loadScores();
            } catch (err) {
                console.error("Error al estimar el gas o enviar la transacción:", err);
                if (err.code === 'CALL_EXCEPTION') {
                    alert('Error: La transacción fue rechazada por el contrato.');
                } else {
                    alert('Error al enviar la transacción.');
                }
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

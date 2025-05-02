
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.7.0/+esm';

const contractAddress = '0x0782D0d995C13D3000F797aA25b5E0399AE7f051'; // Dirección del contrato
const abi = [ 
    "function submitGame(bytes proof, bytes publicInputs, uint256 score) external",
    "function getGame(address player) view returns (tuple(address player, uint256 score, bytes proof))",
];

// Configuración de tu wallet
const privateKey = '6bbab89e4cec36a1745d3c46f797b4c8ab16e2c0606beb4fb9f6ae4d58fec384'; // Reemplaza con tu clave privada
const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/Ax0xmhH5RUlAwzTv3wbpWFgf5T2v5Knz"); // URL de Infura o Alchemy
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, signer);

// Asociar eventos al DOM
document.addEventListener('DOMContentLoaded', () => {
    // Botón de envío
    const submitButton = document.getElementById('submit');
    if (submitButton) {
        submitButton.onclick = async () => {
            const dummyProof = '0x00'; // Aquí enviarías el proof real generado con SP1
            const dummyPublicInputs = '0x00'; // Aquí también los inputs reales
            const dummyScore = 420; // Score real que obtenemos desde nuestro juego

            try {
                const tx = await contract.submitGame(dummyProof, dummyPublicInputs, dummyScore);
                await tx.wait();
                alert('Proof Submitted and Verified! 🚀');
                loadScores();
            } catch (err) {
                console.error(err);
                alert('Submission failed 😭');
            }
        };
    } else {
        console.error('El botón Submit no se encontró en el DOM.');
    }
});

async function loadScores() {
    const player = await signer.getAddress();
    const game = await contract.getGame(player);
    const table = document.getElementById('scoreTable').querySelector('tbody');
    table.innerHTML = `<tr><td>${game.player}</td><td>${game.score}</td></tr>`;
}

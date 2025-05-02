
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.7.0/+esm';

const contractAddress = '0x0782D0d995C13D3000F797aA25b5E0399AE7f051'; // Lo cambiamos luego
const abi = [ 
    "function submitGame(bytes proof, bytes publicInputs, uint256 score) external",
    "function getGame(address player) view returns (tuple(address player, uint256 score, bytes proof))",
];

let provider, signer, contract;

document.getElementById('connect').onclick = async () => {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        alert('Wallet Connected!');
    } else {
        alert('Please install Metamask!');
    }
};

document.getElementById('submit').onclick = async () => {
    if (!contract) return alert('Please connect wallet first!');
    const dummyProof = '0x00'; // Aquí enviaríamos el proof real generado con SP1
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

async function loadScores() {
    if (!contract) return;
    const player = await signer.getAddress();
    const game = await contract.getGame(player);
    const table = document.getElementById('scoreTable').querySelector('tbody');
    table.innerHTML = `<tr><td>${game.player}</td><td>${game.score}</td></tr>`;
}



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
                const name = window.playerName || 'YOU';
                const score = window.finalScore || 0;
                const duration = window.gameDuration || 0;

                console.log('🎮 Enviando al backend SP1:', { name, score, duration });

                const response = await fetch('http://217.65.144.64:3000/generate-proof', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, score, duration })
                });

                if (!response.ok) {
                    throw new Error('❌ Error del backend SP1');
                }

                const { proof, publicInputs } = await response.json();
                console.log('✅ Prueba recibida del backend:', proof, publicInputs);

                const tx = await contract.submitGame(proof, publicInputs, score, {
                    gasLimit: 3000000
                });
                await tx.wait();

                alert('✅ Proof enviada y verificada en la blockchain!');
                loadScores();

            } catch (err) {
                console.error("❌ Error durante el envío:", err);
                alert("Error enviando prueba: " + err.message);
            }
        };
    }
});


import init, { verify_proof } from './verifier.js';

export async function launchZKConsole() {
  const logs = document.getElementById('zkLogs');
  const result = document.getElementById('zkResult');
  const shareBtn = document.getElementById('zkShareButton');
  const consoleBox = document.getElementById('zkConsole');

  consoleBox.style.display = 'block';
  logs.innerHTML = '<span style="color:#ff00aa">[🧠] Initializing SP1 Verifier...</span>';

  try {
    await init();
    logs.innerHTML += '<br><span style="color:#ff00aa">[📥] Loading proof_output.json...</span>';

    const res = await fetch('proof_output.json');
    const data = await res.json();

    logs.innerHTML += '<br><span style="color:#ff00aa">[🔍] Verifying proof...</span>';

    const isValid = verify_proof(data.proof, data.public_inputs, data.vkey_hash);

    if (isValid) {
      logs.innerHTML += '<br><span style="color:#00ffcc">✅ Proof verification SUCCESS</span>';

      // Decodificar public_inputs (hex -> bytes)
      const hex = data.public_inputs.replace(/^0x/, '');
      const buf = new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));

      const nameBytes = buf.slice(0, 32);
      const scoreBytes = buf.slice(32, 40);
      const durationBytes = buf.slice(40, 48);

      const decoder = new TextDecoder();
      const playerName = decoder.decode(nameBytes).replace(/\0/g, '') || 'Anonymous';

      const playerScore = scoreBytes.reduceRight((acc, b, i) => acc + (b << (8 * i)), 0);
      const gameDurationMs = durationBytes.reduceRight((acc, b, i) => acc + (b << (8 * i)), 0);
      const gameDurationSec = (gameDurationMs / 1000).toFixed(2);

      result.innerHTML = `
        <p><strong style="color:#ff00aa">VK:</strong> ${data.vkey_hash}</p>
        <p><strong style="color:#ff00aa">Player:</strong> ${playerName}</p>
        <p><strong style="color:#ff00aa">Score:</strong> ${playerScore}</p>
        <p><strong style="color:#ff00aa">Duration:</strong> ${gameDurationSec} sec</p>
        <p><strong style="color:#999">Raw Inputs:</strong> ${data.public_inputs}</p>
      `;

      shareBtn.style.display = 'inline-block';
      shareBtn.onclick = () => {
        const msg = `✅ I verified my score using Succinct's zk tech! 🧠\nhttps://tetris-succinct-zk.vercel.app`;
        const url = `https://x.com/intent/tweet?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
      };
    } else {
      logs.innerHTML += '<br><span style="color:red">❌ Proof INVALID</span>';
      result.innerHTML = `<span style="color:red">Proof is not valid.</span>`;
    }

  } catch (e) {
    logs.innerHTML += `<br><span style="color:red">❌ Error: ${e.message}</span>`;
    result.innerHTML = `<span style="color:red">Error loading or verifying proof.</span>`;
  }
}


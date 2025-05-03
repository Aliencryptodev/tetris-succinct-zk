
import init, { verify_proof } from './verifier.js';

async function verifyProof() {
  const logs = document.getElementById('zkLogs');
  const result = document.getElementById('zkResult');
  const shareBtn = document.getElementById('zkShareButton');
  const consoleBox = document.getElementById('zkConsole');
  consoleBox.style.display = 'block';

  logs.textContent = '[🧠] Initializing SP1 Verifier...';
  await init();

  try {
    logs.textContent += '\n[📥] Loading proof_output.json...';
    const res = await fetch('proof_output.json');
    const data = await res.json();

    logs.textContent += '\n[🔍] Verifying proof...';
    const isValid = verify_proof(data.proof, data.public_inputs, data.vkey_hash);

    if (isValid) {
      logs.textContent += '\n✅ Proof verification SUCCESS';
      result.innerHTML = `
        <p><strong>VK:</strong> ${data.vkey_hash}</p>
        <p><strong>Inputs:</strong> ${data.public_inputs.substring(0, 64)}...</p>
      `;
      shareBtn.style.display = 'inline-block';
      shareBtn.onclick = () => {
        const msg = \`✅ I verified my score using Succinct's zk tech! 🧠\nhttps://tetris-succinct-zk.vercel.app\`;
        const url = \`https://x.com/intent/tweet?text=\${encodeURIComponent(msg)}\`;
        window.open(url, '_blank');
      };
    } else {
      logs.textContent += '\n❌ Proof INVALID';
      result.innerHTML = `<span style="color:red">Proof is not valid.</span>`;
    }
  } catch (e) {
    logs.textContent += `\n❌ Error: \${e.message}`;
    result.innerHTML = `<span style="color:red">Error loading or verifying proof.</span>`;
  }
}

window.launchZKConsole = verifyProof;

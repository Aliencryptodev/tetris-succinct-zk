
#!/bin/bash
set -e

echo "🔧 Building Tetris Succinct WebAssembly..."
wasm-pack build --target web --out-dir ../frontend/pkg
echo "✅ Build complete!"

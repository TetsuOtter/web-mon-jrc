#!/bin/bash
# Build script that creates DMG with --sandbox-safe for CI/CD environments

set -e

export PATH="$HOME/.cargo/bin:$PATH"

echo "================================"
echo "Building Tauri app (app bundle only)..."
echo "================================"

# Build app bundle only (skip DMG)
yarn tauri icon src-tauri/icons/icon.png
yarn run tauri build --bundles app

echo ""
echo "================================"
echo "Creating DMG with --sandbox-safe..."
echo "================================"

# Run the sandbox-safe DMG creation script
bash create-dmg-sandbox.sh

echo ""
echo "✅ Build complete! DMG created with --sandbox-safe option"

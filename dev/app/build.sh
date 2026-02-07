#!/bin/bash
# Build script that creates DMG with --sandbox-safe for CI/CD environments

set -e

export PATH="$HOME/.cargo/bin:$PATH"

ARGS="${1:-}"  # Accept optional build arguments (e.g., --target aarch64-apple-darwin)

echo "================================"
echo "Building Tauri app (app bundle only)..."
echo "================================"

# Build app bundle only (skip DMG)
yarn run tauri build $ARGS --bundles app

echo ""
echo "================================"
echo "Creating DMG with --sandbox-safe..."
echo "================================"

# Run the sandbox-safe DMG creation script, passing the build arguments
bash create-dmg-sandbox.sh "$ARGS"

echo ""
echo "✅ Build complete! DMG created with --sandbox-safe option"

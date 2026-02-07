#!/bin/bash
# Create DMG with --sandbox-safe option for CI/CD environments

set -e

BUNDLE_DIR="src-tauri/target/release/bundle"
DMG_SCRIPT="$BUNDLE_DIR/dmg/bundle_dmg.sh"
MACOS_BUNDLE="$BUNDLE_DIR/macos/web-mon-native.app"
OUTPUT_DMG="$BUNDLE_DIR/macos/web-mon-native_0.0.1_aarch64.dmg"

echo "Creating DMG with --sandbox-safe option..."

if [ ! -f "$DMG_SCRIPT" ]; then
    echo "Error: DMG script not found at $DMG_SCRIPT"
    exit 1
fi

if [ ! -d "$MACOS_BUNDLE" ]; then
    echo "Error: macOS bundle not found at $MACOS_BUNDLE"
    exit 1
fi

# Make sure script is executable
chmod +x "$DMG_SCRIPT"

# Remove old DMG files
rm -f "$BUNDLE_DIR/macos"/rw.*.dmg
rm -f "$OUTPUT_DMG"

# Create DMG with --sandbox-safe
"$DMG_SCRIPT" \
    --sandbox-safe \
    --volname "web-mon-native" \
    "$OUTPUT_DMG" \
    "$MACOS_BUNDLE"

echo "DMG created successfully at $OUTPUT_DMG"

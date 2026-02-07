#!/bin/bash
# Create DMG with --sandbox-safe option for CI/CD environments

set -e

BUILD_ARGS="${1:-}"

# Extract target architecture from build arguments
# Supports formats like "--target aarch64-apple-darwin" or "--target x86_64-apple-darwin"
TARGET_ARCH=""
if [[ "$BUILD_ARGS" == *"aarch64-apple-darwin"* ]]; then
    TARGET_ARCH="aarch64"
    TARGET_DIR="aarch64-apple-darwin"
elif [[ "$BUILD_ARGS" == *"x86_64-apple-darwin"* ]]; then
    TARGET_ARCH="x86_64"
    TARGET_DIR="x86_64-apple-darwin"
else
    # Default to native architecture
    TARGET_ARCH="$(uname -m)"
    TARGET_DIR="."
fi

# Set bundle directory based on whether we have a specific target
if [ "$TARGET_DIR" = "." ]; then
    BUNDLE_DIR="src-tauri/target/release/bundle"
else
    BUNDLE_DIR="src-tauri/target/$TARGET_DIR/release/bundle"
fi

DMG_SCRIPT="$BUNDLE_DIR/dmg/bundle_dmg.sh"
MACOS_BUNDLE="$BUNDLE_DIR/macos/web-mon-native.app"
OUTPUT_DMG="$BUNDLE_DIR/macos/web-mon-native_0.0.1_${TARGET_ARCH}.dmg"

echo "Creating DMG with --sandbox-safe option..."
echo "Target architecture: $TARGET_ARCH"
echo "Bundle directory: $BUNDLE_DIR"

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

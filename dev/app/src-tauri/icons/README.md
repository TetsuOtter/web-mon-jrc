# Tauri Icons

This directory should contain the application icons for different platforms.

## Generating Icons

To generate the required icon files, you need a source PNG image (1024x1024 or larger) and run:

```bash
yarn tauri icon path/to/your/icon.png
```

This will generate all the required icon files:
- 32x32.png
- 128x128.png
- 128x128@2x.png
- icon.icns (macOS)
- icon.ico (Windows)

## Required Files

The following files are required for building the application:
- `32x32.png` - Small icon for Windows
- `128x128.png` - Medium icon
- `128x128@2x.png` - High DPI icon
- `icon.icns` - macOS app icon
- `icon.ico` - Windows app icon

Until these icons are generated, the build process may fail.

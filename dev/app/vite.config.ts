import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode: _mode }) => ({
	base: process.env.VITE_BASE || "/",
	plugins: [react()],
	resolve: {
		alias: {
			"@web-mon-jrc/canvas-renderer": path.resolve(
				__dirname,
				"../canvas-renderer/src"
			),
		},
	},
	server: {
		allowedHosts: ["localhost", "127.0.0.1"],
		port: 5173,
		strictPort: true,
	},
	// Tauri expects a fixed port, fail if that port is not available
	clearScreen: false,
	// tauri-cli handles environment variables
	envPrefix: ["VITE_", "TAURI_"],
	build: {
		// Tauri uses Chromium on Windows and WebKit on macOS and Linux
		target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
		// don't minify for debug builds
		minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
		// produce sourcemaps for debug builds
		sourcemap: !!process.env.TAURI_DEBUG,
	},
}));

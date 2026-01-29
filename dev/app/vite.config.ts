import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react()],
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

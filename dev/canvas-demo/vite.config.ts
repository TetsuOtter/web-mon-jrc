import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
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
		port: 5174,
	},
});

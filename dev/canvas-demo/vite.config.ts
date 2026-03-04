import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

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

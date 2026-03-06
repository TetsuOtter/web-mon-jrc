import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
	plugins: [react()],
	resolve: {
		dedupe: ["react"],
	},
	optimizeDeps: {
		exclude: ["@web-mon-jrc/canvas-renderer"],
		include: ["react", "react-dom"],
	},
	server: {
		port: 5174,
	},
});

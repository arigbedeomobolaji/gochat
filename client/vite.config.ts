import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@screens": path.resolve(__dirname, "./src/screens/"),
			"@components": path.resolve(__dirname, "./src/components/"),
		},
	},
	plugins: [react()],
});

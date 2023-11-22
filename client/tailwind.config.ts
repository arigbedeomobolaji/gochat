import type { Config } from "tailwindcss";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				lato: ["Lato", "sans"],
			},
		},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
	important: true,
} satisfies Config;

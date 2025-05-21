import {defineConfig} from "vite";

export default defineConfig({
	root: "site",
	base: "",
	build: {
		target: "es2022",
		outDir: "../dist",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				"main": "site/index.html",
				"recent": "site/recent/index.html",
				"recent-about": "site/recent/about.html",
				"kinch": "site/kinch-ranks/index.html",
				"kinch-faq": "site/kinch-ranks/faq.html"
			},
		},
	},
});

import {defineConfig} from "vite";

export default defineConfig({
	root: "src",
	base: "",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: "src/index.html",
				recent: "src/recent/index.html",
				"recent-about": "src/recent/about.html",
				kinch: "src/kinch-ranks/index.html",
			},
		},
	},
});

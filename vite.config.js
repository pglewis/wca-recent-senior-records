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
				about: "src/about/index.html",
			},
		},
	},
});

import {defineConfig} from "vite";
import domJsx from "vite-plugin-dom-jsx";

export default defineConfig({
	root: "src",
	base: "",
	plugins: [
		domJsx({})
	],
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

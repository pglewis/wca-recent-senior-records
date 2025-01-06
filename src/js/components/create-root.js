// @ts-check
/** @type {import("./create-root").createRoot} */
export function createRoot(selectors) {
	const root = document.querySelector(selectors);

	/**@type {import("./create-root").RenderCB} */
	function render(node) {
		if (!root) {
			throw new Error(`render(): "${selectors}" was not found`);
		}

		if (Array.isArray(node)) {
			root.replaceChildren(...node);
		} else {
			root.replaceChildren(node);
		}
	}

	return {
		render: render,
	};
}

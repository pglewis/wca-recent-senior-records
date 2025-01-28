type RenderCB = (node: Node | Node[]) => void

interface Root {
	render: RenderCB
}

/**
 * @param selectors - CSS selector(s) targetting the DOM element to be used for the root
 * @returns         a Root object with a render method
 */
export function createRoot(selectors: string): Root {
	const root = document.querySelector(selectors);

	/**
	 * @param node - node or node array to replace the root DOM element's content
	 * @throws
	 */
	function render(node: Node | Node[]): void {
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

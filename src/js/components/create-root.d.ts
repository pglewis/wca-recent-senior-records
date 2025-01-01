export type RenderCB = (node: Node | Node[]) => void

export type Root = {
	/**
	 * @param node node or node array to replace the root DOM element's content
	 */
	render: RenderCB
}

/**
 * @param selectors CSS selector(s) targetting the DOM element to be used for the root
 */
export declare function createRoot(selectors: string): Root

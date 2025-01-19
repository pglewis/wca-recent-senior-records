/**
 * Helper function. Requires a single, root HTMLElement inside the template
 *
 * Finds the first template element in the document that matches the
 * specified group of selectors, clones its content, and returns the
 * root HTMLElement inside DocumentFragment.
 * @param selectors
 * @returns
 * @throws
 */
export function getTemplateElement(selectors: string): HTMLElement {
	const template = document.querySelector<HTMLTemplateElement>(`template${selectors}`);

	if (!template) {
		// Check typical selector mistakes: typo, missing # or .
		throw new Error(`Unable to find "${selectors}" in getTemplateElement()`);
	}

	// Clone the template content and grab the first
	// HTMLElement from the DocumentFragment
	const clone = template.content.cloneNode(true) as DocumentFragment;
	const element = clone.firstElementChild;
	if (!(element instanceof HTMLElement)) {
		throw new Error(`Template "${selectors}" does not contain an HTML element`);
	}

	return element;
}

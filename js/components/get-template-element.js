/**
 * Helper function. Requires a single, root HTMLElement inside the template
 *
 * Finds the first template element in the document that matches the
 * specified group of selectors, clones its content, and returns the
 * root HTMLElement inside DocumentFragment.
 *
 * @param {string} selectors
 *
 * @returns {HTMLElement}
 */
export function getTemplateElement(selectors) {
	const template = document.querySelector(`template${selectors}`);

	if (!template) {
		// Check typical selector mistakes: typo, missing # or .
		throw `Unable to find "${selectors}" in getTemplateElement()`;
	}

	// Clone the template content and grab the first
	// HTMLElement from the DocumentFragment
	const element = template.content.cloneNode(true).firstElementChild;

	return element;
}

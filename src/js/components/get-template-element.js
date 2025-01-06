// @ts-check
/** @type {import("./get-template-element").getTemplateElement} */
export function getTemplateElement(selectors) {
	const template = /**@type {HTMLTemplateElement|null}*/
		(document.querySelector(`template${selectors}`));

	if (!template) {
		// Check typical selector mistakes: typo, missing # or .
		throw new Error(`Unable to find "${selectors}" in getTemplateElement()`);
	}

	// Clone the template content and grab the first
	// HTMLElement from the DocumentFragment
	const clone = /**@type {DocumentFragment}*/(template.content.cloneNode(true));
	const element = clone.firstElementChild;
	if (!(element instanceof HTMLElement)) {
		throw new Error(`Template "${selectors}" does not contain an HTML element`);
	}

	return element;
}

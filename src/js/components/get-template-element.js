
/** @type {import("./get-template-element").getTemplateElement} */
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

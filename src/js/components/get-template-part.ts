export function getTemplatePart<Expected extends HTMLElement = HTMLElement>(
	parentNode: HTMLElement,
	selectors: string,
	expectedType?: new () => Expected
): Expected {
	const target = parentNode.querySelector<Expected>(selectors);

	if (!target || (expectedType && !(target instanceof expectedType))) {
		throw new Error(`No ${expectedType?.name ?? "HTMLELement"} element found matching ${selectors}`);
	}

	return target;
}

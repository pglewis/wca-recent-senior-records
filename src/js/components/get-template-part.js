// @ts-check
/** @type {import("./get-template-part").getTemplatePart} */
export function getTemplatePart(parentNode, selectors, expectedType) {
	const target = parentNode.querySelector(selectors);

	if (!target || !(target instanceof expectedType)) {
		throw new Error(`No ${expectedType.name} element found matching ${selectors}`);
	}

	return target;
}

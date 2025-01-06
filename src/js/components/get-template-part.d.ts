export declare function getTemplatePart<Expected extends HTMLElement = HTMLElement>(
	parentNode: HTMLElement,
	selectors: string,
	expectedType: new () => Expected
): Expected

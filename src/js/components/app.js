// @ts-check
import {getTemplateElement} from "./get-template-element.js";
import {getTemplatePart} from "./get-template-part.js";
import {Info} from "./info.js";
import {Panel} from "./panel.js";
import {Results} from "./results.js";

/** @type {import("./app.js").App} */
export function App(props) {
	const nodes = [];

	nodes.push(Info(props), Panel(props), Results(props));

	return nodes;
}

/** @type {import("./app.js").Loading} */
export function Loading() {
	return getTemplateElement("#loading-template");
}

/** @type {import("./app.js").ErrorMessage} */
export function ErrorMessage(message) {
	const errorMessage = getTemplateElement("#error-template");
	const messageNode = getTemplatePart(errorMessage, ".message", HTMLElement);

	messageNode.textContent = message;

	return errorMessage;
}

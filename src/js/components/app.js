import {getTemplateElement} from "./get-template-element.js";
import {Info} from "./info.js";
import {Panel} from "./panel.js";
import {Results} from "./results.js";

/** @type {import("./app").App} */
export function App(props) {
	const nodes = [];

	nodes.push(Info(props), Panel(props), Results(props));

	return nodes;
}

/** @type {import("./app").Loading} */
export function Loading() {
	return getTemplateElement("#loading-template");
}

/** @type {import("./app").ErrorMessage} */
export function ErrorMessage(message) {
	const errorMessage = getTemplateElement("#error-template");
	const messageNode = errorMessage.querySelector(".message");

	messageNode.textContent = message;

	return errorMessage;
}

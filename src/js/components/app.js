import {getTemplateElement} from "./get-template-element.js";
import {Info} from "./info.js";
import {Panel} from "./panel.js";
import {Results} from "./results.js";

/**
 * @param {string} selectors
 *
 * @returns {Root}
 */
export function createRoot(selectors) {
	const root = document.querySelector(selectors);

	/**
	 * @param {Node|Node[]} node
	 */
	function render(node) {
		if (Array.isArray(node)) {
			root.replaceChildren(...node);
		} else {
			root.replaceChildren(node);
		}
	}

	return {
		render: render,
	};
}

/**
 * @param {Object}     props
 * @param {DataStore}  props.store
 * @param {Function}   props.handleRender  Callback to re-render
 *
 * @returns {HTMLElement[]}
 */
export function App(props) {
	const nodes = [];

	nodes.push(Info(props), Panel(props), Results(props));

	return nodes;
}

/**
 * @returns {HTMLElement}
 */
export function Loading() {
	return getTemplateElement("#loading-template");
}

/**
 * @param {string} message
 *
 * @returns {HTMLElement}
 */
export function ErrorMessage(message) {
	const errorMessage = getTemplateElement("#error-template");
	const messageNode = errorMessage.querySelector(".message");

	messageNode.textContent = message;

	return errorMessage;
}

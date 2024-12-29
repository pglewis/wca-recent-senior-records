import {getTemplateElement} from "./get-template-element.js";
import {Panel} from "./panel.js";
import {ResultsTable} from "./results-table.js";

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
	const {results} = props.store.getState();
	const nodes = [];

	nodes.push(Info(props));
	nodes.push(Panel(props));

	if (results.length === 0) {
		nodes.push(NoResults());
	} else {
		nodes.push(ResultsTable(props));
	}

	return nodes;
}

/**
 * @param {Object}     props
 * @param {DataStore}  props.store
 *
 * @returns {HTMLElement}
 */
function Info(props) {
	const {store} = props;
	const {results} = store.getState();
	const {lastUpdated} = store.getState().rankings;
	const {topN, recentInDays} = store.getState().filters;

	const rootElement = getTemplateElement("#info-template");
	const info = rootElement.querySelector(".result-info");
	const refreshed = rootElement.querySelector(".refreshed");

	info.textContent = `Showing ${results.length} results in the top ${topN} set in the past ${recentInDays} day(s)`;
	refreshed.textContent = `Last refreshed: ${lastUpdated} (UTC)`;

	return rootElement;
}

/**
 * @returns {HTMLElement}
 */
function NoResults() {
	return getTemplateElement("#no-results-template");
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

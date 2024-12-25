import {setTopNAction, setRecentInDaysAction, clearResultsAction} from "../state/state.js";
import {getTemplateElement} from "./get-template-element.js";
import {SortColumnList} from "./sort-column-list.js";
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
 * @returns {HTMLElement}
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
 * @param {Function}   props.handleRender  Callback to re-render
 *
 * @returns {HTMLElement}
 */
function Info(props) {
	const {store} = props;
	const {
		results,
		dataLastUpdated,
		topN,
		recentInDays
	} = store.getState();

	const rootElement = getTemplateElement("#info-template");

	const info = rootElement.querySelector(".result-info");
	const refreshed = rootElement.querySelector(".refreshed");

	info.textContent = `Showing ${results.length} results in the top ${topN} set in the past ${recentInDays} day(s)`;
	refreshed.textContent = `Last refreshed: ${dataLastUpdated} (UTC)`;

	return rootElement;
}

/**
 * @param {Object}    props
 * @param {DataStore} props.store
 * @param {Function}  props.handleRender
 *
 * @returns {HTMLElement}
 */
function Panel(props) {
	const {store, handleRender} = props || {};
	const {recentInDays, topN} = store.getState();

	const panelRoot = getTemplateElement("#panel-template");
	const panelGrid = panelRoot.querySelector(".panel-grid");
	const parameters = getTemplateElement("#parameters-template");

	/** Recent in days select box @type {HTMLSelectElement} */
	const recentSelect = parameters.querySelector("#recent-in-days");
	recentSelect.value = recentInDays;
	recentSelect.addEventListener("change", (e) => {
		store.dispatch(setRecentInDaysAction(+e.currentTarget.value));
		store.dispatch(clearResultsAction());
		handleRender();
	});

	/** Top N select box @type {HTMLSelectElement} */
	const topNSelect = parameters.querySelector("#top-n");
	topNSelect.value = topN;
	topNSelect.addEventListener("change", (e) => {
		store.dispatch(setTopNAction(+e.currentTarget.value));
		store.dispatch(clearResultsAction());
		handleRender();
	});

	panelGrid.append(SortColumnList(props), parameters);

	return panelRoot;
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

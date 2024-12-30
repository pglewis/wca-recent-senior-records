import {getTemplateElement} from "./get-template-element.js";

/**
 * @param {Object}     props
 * @param {DataStore}  props.store
 *
 * @returns {HTMLElement}
 */
export function Info(props) {
	const {store} = props;
	const {results} = store.getState();
	const {lastUpdated} = store.getState().rankings;
	const {topN, recentInDays, search} = store.getState().filters;

	const rootElement = getTemplateElement("#info-template");
	const info = rootElement.querySelector(".result-info");
	const refreshed = rootElement.querySelector(".refreshed");

	refreshed.textContent = `Last refreshed: ${lastUpdated} (UTC)`;
	info.textContent =
		`Showing ${results.length} ${results.length === 1 ? "result" : "results"} `
		+ `${search ? ' matching "' + search + '"' : ""} `
		+ `in the top ${topN} set in the past ${recentInDays} day(s) `;

	return rootElement;
}

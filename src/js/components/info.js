// @ts-check
import {getTemplateElement} from "./get-template-element.js";
import {getTemplatePart} from "./get-template-part.js";

/** @type {import("./info.js").Info} */
export function Info(props) {
	const {store} = props;
	const {results} = store.getState();
	const {lastUpdated} = store.getState().rankings;
	const {topN, recentInDays, search} = store.getState().filters;

	const rootElement = getTemplateElement("#info-template");
	const info = getTemplatePart(rootElement, ".result-info", HTMLElement);
	const refreshed = getTemplatePart(rootElement, ".refreshed", HTMLElement);

	refreshed.textContent = `Last refreshed: ${lastUpdated} (UTC)`;
	info.textContent =
		`Showing ${results.length} ${results.length === 1 ? "result" : "results"} `
		+ `${search ? ' matching "' + search + '"' : ""} `
		+ `in the top ${topN} set in the past ${recentInDays} day(s) `;

	return rootElement;
}

import {getTemplateElement} from "./get-template-element";
import {getTemplatePart} from "./get-template-part";
import {AppProps} from "./app";

export function Info(props: AppProps): HTMLElement {
	const {store} = props;
	const {results} = store.getState();
	const {lastUpdated} = store.getState().rankings;
	const {topN, timeFrame, search} = store.getState().filters;

	const rootElement = getTemplateElement("#info-template");
	const info = getTemplatePart(rootElement, ".result-info");
	const refreshed = getTemplatePart(rootElement, ".refreshed");

	refreshed.textContent = `Last refreshed: ${lastUpdated} (UTC)`;
	info.textContent =
		`Showing ${results.length} ${results.length === 1 ? "result" : "results"} `
		+ `${search ? ' matching "' + search + '"' : ""} `
		+ `in the top ${topN} set in the past ${timeFrame} day(s) `;

	return rootElement;
}

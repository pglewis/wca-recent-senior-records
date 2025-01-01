import {getTemplateElement} from "./get-template-element.js";
import {setTopNAction, setRecentInDaysAction} from "../state/filters-reducer.js";

/** @type {import("./parameters").Parameters} */
export function Parameters(props) {
	const {store, handleRender} = props;
	const {recentInDays, topN} = store.getState().filters;
	const root = getTemplateElement("#parameters-template");

	/** Recent in days select box @type {HTMLSelectElement} */
	const recentSelect = root.querySelector("#recent-in-days");
	recentSelect.value = recentInDays;
	recentSelect.addEventListener("change", (e) => {
		store.dispatch(setRecentInDaysAction(+e.target.value));
		handleRender();
	});

	/** Top N select box @type {HTMLSelectElement} */
	const topNSelect = root.querySelector("#top-n");
	topNSelect.value = topN;
	topNSelect.addEventListener("change", (e) => {
		store.dispatch(setTopNAction(+e.target.value));
		handleRender();
	});

	return root;
}

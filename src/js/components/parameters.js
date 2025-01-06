// @ts-check
import {getTemplateElement} from "./get-template-element.js";
import {getTemplatePart} from "./get-template-part.js";
import {setTopNAction, setRecentInDaysAction} from "../state/filters-reducer.js";

/** @type {import("./parameters").Parameters} */
export function Parameters(props) {
	const {store, handleRender} = props;
	const {recentInDays, topN} = store.getState().filters;
	const root = getTemplateElement("#parameters-template");

	const recentSelect = getTemplatePart(root, "#recent-in-days", HTMLSelectElement);
	recentSelect.value = String(recentInDays);
	recentSelect.addEventListener("change", (e) => {
		const select = /**@type {HTMLSelectElement} */(e.currentTarget);
		store.dispatch(setRecentInDaysAction(Number(select.value)));
		handleRender();
	});

	/** Top N select box */
	const topNSelect = getTemplatePart(root, "#top-n", HTMLSelectElement);
	topNSelect.value = String(topN);
	topNSelect.addEventListener("change", (e) => {
		const select = /**@type {HTMLSelectElement} */(e.currentTarget);
		store.dispatch(setTopNAction(Number(select.value)));
		handleRender();
	});

	return root;
}

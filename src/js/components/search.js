// @ts-check
import {getTemplateElement} from "./get-template-element.js";
import {setSearchFilterAction} from "../state/filters-reducer.js";
import {getTemplatePart} from "./get-template-part.js";

/** @type {import("./search").Search} */
export function Search(props) {
	const {store, handleRender} = props;
	const {search} = store.getState().filters;
	const root = getTemplateElement("#search-template");
	const input = getTemplatePart(root, "input", HTMLInputElement);

	input.value = search;
	input.addEventListener("input", (e) => {
		const inputElement = /**@type {HTMLInputElement}*/(e.currentTarget);
		store.dispatch(setSearchFilterAction(inputElement.value));
		handleRender();
	});

	return root;
}

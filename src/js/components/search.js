import {getTemplateElement} from "./get-template-element.js";
import {setSearchFilterAction} from "../state/filters-reducer.js";

/** @type {import("./search").Search} */
export function Search(props) {
	const {store, handleRender} = props;
	const {search} = store.getState().filters;
	const root = getTemplateElement("#search-template");
	const input = root.querySelector("input");

	input.value = search || "";
	input.addEventListener("input", (e) => {
		store.dispatch(setSearchFilterAction(e.target.value));
		handleRender();
	});

	return root;
}

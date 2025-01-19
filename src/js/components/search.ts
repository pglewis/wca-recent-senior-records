import {AppProps} from "./app";
import {getTemplateElement} from "./get-template-element";
import {setSearchFilterAction} from "../app-state/filters-reducer";
import {getTemplatePart} from "./get-template-part";

export function Search(props: AppProps): HTMLElement {
	const {store, handleRender} = props;
	const {search} = store.getState().filters;
	const root = getTemplateElement("#search-template");
	const input = getTemplatePart(root, "input", HTMLInputElement);

	input.value = search;
	input.addEventListener("input", (e) => {
		const inputElement = e.currentTarget as HTMLInputElement;
		store.dispatch(setSearchFilterAction(inputElement.value));
		handleRender();
	});

	return root;
}

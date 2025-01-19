import {type AppProps} from "./app";
import {setTopNAction, setRecentInDaysAction} from "../app-state/filters-reducer";
import {getTemplateElement} from "./get-template-element";
import {getTemplatePart} from "./get-template-part";

export function Parameters(props: AppProps): HTMLElement {
	const {store, handleRender} = props;
	const {timeFrame, topN} = store.getState().filters;
	const root = getTemplateElement("#parameters-template");

	/* Time frame select box */
	const timeFrameSelect = getTemplatePart(root, "#time-frame", HTMLSelectElement);
	timeFrameSelect.value = String(timeFrame);
	timeFrameSelect.addEventListener("change", (e) => {
		const select = e.currentTarget as HTMLSelectElement;
		store.dispatch(setRecentInDaysAction(Number(select.value)));
		handleRender();
	});

	/** Top N select box */
	const topNSelect = getTemplatePart(root, "#top-n", HTMLSelectElement);
	topNSelect.value = String(topN);
	topNSelect.addEventListener("change", (e) => {
		const select = e.currentTarget as HTMLSelectElement;
		store.dispatch(setTopNAction(Number(select.value)));
		handleRender();
	});

	return root;
}

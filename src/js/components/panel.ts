import {AppProps} from "./app";
import {getTemplateElement} from "./get-template-element";
import {getTemplatePart} from "./get-template-part";
import {SortColumnList} from "./sort-column-list";
import {Search} from "./search";
import {Parameters} from "./parameters";

export function Panel(props: AppProps): HTMLElement {
	const root = getTemplateElement("#panel-template");
	const panelGrid = getTemplatePart(root, ".panel-grid");

	panelGrid.append(Search(props), Parameters(props), SortColumnList(props));

	return root;
}

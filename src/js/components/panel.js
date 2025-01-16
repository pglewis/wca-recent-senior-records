// @ts-check
import {getTemplateElement} from "./get-template-element.js";
import {getTemplatePart} from "./get-template-part.js";
import {SortColumnList} from "./sort-column-list.js";
import {Search} from "./search.js";
import {Parameters} from "./parameters.js";

/** @type {import("./panel").Panel} */
export function Panel(props) {
	const root = getTemplateElement("#panel-template");
	const panelGrid = getTemplatePart(root, ".panel-grid", HTMLElement);

	panelGrid.append(Search(props), Parameters(props), SortColumnList(props));

	return root;
}

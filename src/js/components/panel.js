import {getTemplateElement} from "./get-template-element.js";
import {SortColumnList} from "./sort-column-list.js";
import {Search} from "./search.js";
import {Parameters} from "./parameters.js";

/**
 * @param {Object} props
 *
 * @returns {HTMLElement}
 */
export function Panel(props) {
	const root = getTemplateElement("#panel-template");
	const panelGrid = root.querySelector(".panel-grid");

	panelGrid.append(SortColumnList(props), Search(props), Parameters(props));

	return root;
}

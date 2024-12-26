import {getTemplateElement} from "./get-template-element.js";
import {
	updateSearchFilterAction,
	setTopNAction,
	setRecentInDaysAction,
} from "../state/state.js";
import {SortColumnList} from "./sort-column-list.js";

/**
 * @param {Object}    props
 * @param {DataStore} props.store
 * @param {Function}  props.handleRender
 *
 * @returns {HTMLElement}
 */
export function Panel(props) {
	const root = getTemplateElement("#panel-template");
	const panelGrid = root.querySelector(".panel-grid");

	panelGrid.append(SortColumnList(props), Search(props), Parameters(props));

	return root;
}

/**
 * @param {Object}    props
 * @param {DataStore} props.store
 * @param {Function}  props.handleRender
 *
 * @returns {HTMLElement}
 */
function Search(props) {
	const {store, handleRender} = props;
	const filters = store.getState().filters;
	const root = getTemplateElement("#search-template");
	const input = root.querySelector("input");

	input.value = filters.search || "";
	input.addEventListener("input", (e) => {
		store.dispatch(updateSearchFilterAction(e.target.value));
		handleRender();
	});

	return root;
}

/**
 * @param {Object}    props
 * @param {DataStore} props.store
 * @param {Function}  props.handleRender
 *
 * @returns {HTMLElement}
 */
function Parameters(props) {
	const {store, handleRender} = props;
	const {recentInDays, topN} = store.getState();
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
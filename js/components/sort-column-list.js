import { updateSortFieldsAction, sortResultsAction } from "../state/state.js";
import { getTemplateElement } from "./get-template-element.js";

/** @type {DataStore} */
let store;

/** @type {Function} */
let handleRender;

/** @type {HTMLElement} */
let beingDragged;

/**
 * @param {Object}    props
 * @param {DataStore} props.store
 * @param {Function}  props.handleRender
 *
 * @returns {HTMLElement}
 */
export function SortColumnList(props) {
	//--! TODO: scope duct-tape
	store = props.store;
	handleRender = props.handleRender;

	const { sortColumns } = store.getState();
	const colList = getTemplateElement("#sort-column-list-template");

	for (const [index, sortColumn] of sortColumns.entries()) {
		const root = getTemplateElement("#sort-column-template");
		const buttonNode = root.querySelector("button");
		const sortLevels = { 0: "primary", 1: "secondary", 2: "tertiary" };
		const sortDirection = sortColumn.direction == 1 ? "ascending" : "descending";

		buttonNode.classList.add(sortDirection);
		buttonNode.classList.add(sortLevels[index]);
		buttonNode.dataset.sortOn = sortColumn.name;
		buttonNode.dataset.position = index;
		buttonNode.textContent = sortColumn.label;

		buttonNode.addEventListener("dragstart", handleDragStart);
		buttonNode.addEventListener("dragenter", handleDragEnter);
		buttonNode.addEventListener("dragover", handleDragOver);
		buttonNode.addEventListener("dragleave", handleDragLeave);
		buttonNode.addEventListener("drop", handleDrop);
		buttonNode.addEventListener("dragend", handleDragEnd);
		buttonNode.addEventListener("click", handleClick);

		colList.append(root);
	}

	return colList;
}

/**
 * @param {MouseEvent} e
 */
function handleClick(e) {
	const buttonNode = e.target;

	store.dispatch(updateSortFieldsAction({
		name: buttonNode.dataset.sortOn,
		label: buttonNode.textContent,
		position: buttonNode.dataset.position,
		defaultDirection: null
	}));
	store.dispatch(sortResultsAction());
	handleRender();
}

/**
 * @param {DragEvent} e
 */
export function handleDragStart(e) {
	/** @type {HTMLElement} */
	const node = e.target;
	beingDragged = node;

	node.style.opacity = "0.4";
	e.dataTransfer.effectAllowed = "move";

	e.dataTransfer.setData("text/html", "<h3>Bob!<h3>");
}

/**
 * @param {DragEvent} e
 */
export function handleDragOver(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = "move";
	return false;
}

/**
 * @param {DragEvent} e
 */
export function handleDragEnter(e) {
	e.target.classList.add("over");
}

/**
 * @param {DragEvent} e
 */
export function handleDragLeave(e) {
	e.target.classList.remove("over");
}

/**
 * @param {DragEvent} e
 */
function handleDrop(e) {
	const node = e.target;
	e.stopPropagation();

	node.classList.remove("over");

	if (beingDragged.dataset.sortOn !== node.dataset.sortOn) {
		store.dispatch(updateSortFieldsAction({
			name: beingDragged.dataset.sortOn,
			label: beingDragged.textContent.replace(/[\r\n\t]/g, ""),
			position: node.dataset.position,
			defaultDirection: beingDragged.dataset.defaultDirection || null
		}));

		store.dispatch(sortResultsAction());
		handleRender();
	}

	return false;
}

/**
 * @param {DragEvent} e
 */
export function handleDragEnd(e) {
	e.target.removeAttribute("style");
}

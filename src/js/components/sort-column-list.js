/**
 * @typedef {import("../state/state").DataStore} DataStore
 */
import {getTemplateElement} from "./get-template-element.js";
import {updateSortColumnsAction} from "../state/sort-columns-reducer.js";

/** @type {DataStore} */
let store;

/** @type {Function} */
let handleRender;

/** @type {HTMLElement} */
let dragNode;

/** @type {import("./sort-column-list").SortColumnList} */
export function SortColumnList(props) {
	//--! TODO: scope duct-tape
	store = props.store;
	handleRender = props.handleRender;

	const {sortColumns} = store.getState();
	const colList = getTemplateElement("#sort-column-list-template");

	for (const [colIndex, sortColumn] of sortColumns.entries()) {
		const root = getTemplateElement("#sort-column-template");
		const buttonNode = root.querySelector("button");
		const sortLevels = {0: "primary", 1: "secondary", 2: "tertiary"};
		const sortDirection = sortColumn.direction == 1 ? "ascending" : "descending";

		buttonNode.classList.add(sortDirection);
		buttonNode.classList.add(sortLevels[colIndex]);
		buttonNode.dataset.sortOn = sortColumn.name;
		buttonNode.dataset.position = colIndex;
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
 * Toggle sort direction
 * @param {MouseEvent} e
 */
function handleClick(e) {
	const buttonNode = e.target;

	store.dispatch(updateSortColumnsAction({
		name: buttonNode.dataset.sortOn,
		label: buttonNode.textContent,
		position: +buttonNode.dataset.position,
		defaultDirection: null
	}));
	handleRender();
}

/**
 * @param {DragEvent} e
 */
export function handleDragStart(e) {
	/** @type {HTMLElement} */
	const node = e.target;
	dragNode = node;

	node.style.opacity = "0.4";
	e.dataTransfer.effectAllowed = "move";
}

/**
 * @param {DragEvent} e
 */
export function handleDragOver(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = "move";
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
	const dropNode = e.target;
	e.stopPropagation();

	dropNode.classList.remove("over");

	if (dragNode.dataset.sortOn !== dropNode.dataset.sortOn) {
		store.dispatch(updateSortColumnsAction({
			name: dragNode.dataset.sortOn,
			label: dragNode.textContent.trim(),
			position: +dropNode.dataset.position,
			defaultDirection: dragNode.dataset.defaultDirection || null
		}));
		handleRender();
	}
}

/**
 * @param {DragEvent} e
 */
export function handleDragEnd(e) {
	e.target.removeAttribute("style");
}

// @ts-check

/** @typedef {import("../state/state").DataStore} DataStore */
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
		const buttonNode = getTemplateElement("#sort-column-template");
		const sortLevels = {0: "primary", 1: "secondary", 2: "tertiary"};
		const sortDirection = sortColumn.direction == 1 ? "ascending" : "descending";

		buttonNode.classList.add(sortDirection);
		buttonNode.classList.add(sortLevels[colIndex]);
		buttonNode.dataset.sortOn = sortColumn.name;
		buttonNode.dataset.position = String(colIndex);

		const labelNode = document.createTextNode(sortColumn.label);
		buttonNode.insertBefore(labelNode, buttonNode.firstChild);

		buttonNode.addEventListener("dragstart", handleDragStart);
		buttonNode.addEventListener("dragenter", handleDragEnter);
		buttonNode.addEventListener("dragover", handleDragOver);
		buttonNode.addEventListener("dragleave", handleDragLeave);
		buttonNode.addEventListener("drop", handleDrop);
		buttonNode.addEventListener("dragend", handleDragEnd);
		buttonNode.addEventListener("click", handleClick);

		colList.append(buttonNode);
	}

	return colList;
}

/**
 * Toggle sort direction
 * @param {MouseEvent} e
 */
function handleClick(e) {
	const buttonNode = /**@type {HTMLButtonElement}*/(e.currentTarget);
	const name = String(buttonNode.dataset.sortOn);
	const label = String(buttonNode.textContent);
	const position = Number(buttonNode.dataset.position);

	store.dispatch(updateSortColumnsAction({
		name: name,
		label: label,
		position: /** @type {0|1|2} */(position),
		defaultDirection: null
	}));
	handleRender();
}

/**
 * @param {DragEvent} e
 */
export function handleDragStart(e) {
	const element = /**@type {HTMLElement}*/(e.currentTarget);
	const dataTransfer = /**@type {DataTransfer}*/(e.dataTransfer);

	dragNode = element;
	element.style.opacity = "0.4";
	dataTransfer.effectAllowed = "move";
}

/**
 * @param {DragEvent} e
 */
export function handleDragOver(e) {
	const dataTransfer = /**@type {DataTransfer}*/(e.dataTransfer);

	e.preventDefault();
	dataTransfer.dropEffect = "move";
}

/**
 * @param {DragEvent} e
 */
export function handleDragEnter(e) {
	const element = /**@type {HTMLElement}*/(e.currentTarget);
	element.classList.add("over");
}

/**
 * @param {DragEvent} e
 */
export function handleDragLeave(e) {
	const element = /**@type {HTMLElement}*/(e.currentTarget);
	element.classList.remove("over");
}

/**
 * @param {DragEvent} e
 */
function handleDrop(e) {
	const dropNode = /**@type {HTMLElement} */(e.currentTarget);
	e.stopPropagation();

	dropNode.classList.remove("over");

	if (dragNode.dataset.sortOn !== dropNode.dataset.sortOn) {
		const labelNode = dragNode.querySelector("span.text");
		const name = String(dragNode.dataset.sortOn);
		const label = String(labelNode?.textContent).trim();
		const position = Number(dropNode.dataset.position);
		const defaultDirection = Number(dragNode.dataset.defaultDirection) || null;

		store.dispatch(updateSortColumnsAction({
			name: name,
			label: label,
			position: /**@type {0|1|2}*/(position),
			defaultDirection: /**@type {1|-1|null}*/(defaultDirection)
		}));
		handleRender();
	}
}

/**
 * @param {DragEvent} e
 */
export function handleDragEnd(e) {
	const element = /**@type {HTMLElement}*/(e.currentTarget);
	element.removeAttribute("style");
}

import type {DataStore} from "../state/state";
import type {AppProps} from "./app";
import {updateSortColumnsAction} from "../app-state/sort-columns-reducer";
import {getTemplateElement} from "./get-template-element";
import {AppState} from "../app-state/app-state";

let store: DataStore<AppState>;
let handleRender: () => void;
let dragNode: HTMLElement;

export function SortColumnList(props: AppProps): HTMLElement {
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
		buttonNode.classList.add(sortLevels[colIndex as 0 | 1 | 2]);
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

function handleClick(e: MouseEvent) {
	const buttonNode = e.currentTarget as HTMLButtonElement;
	const name = String(buttonNode.dataset.sortOn);
	const label = String(buttonNode.textContent);
	const position = Number(buttonNode.dataset.position);

	store.dispatch(updateSortColumnsAction({
		name: name,
		label: label,
		position: position as 0 | 1 | 2,
		defaultDirection: null
	}));
	handleRender();
}

export function handleDragStart(e: DragEvent) {
	const element = e.currentTarget as HTMLElement;
	const dataTransfer = e.dataTransfer as DataTransfer;

	dragNode = element;
	element.style.opacity = "0.4";
	dataTransfer.effectAllowed = "move";
}

export function handleDragOver(e: DragEvent) {
	const dataTransfer = e.dataTransfer as DataTransfer;

	e.preventDefault();
	dataTransfer.dropEffect = "move";
}

export function handleDragEnter(e: MouseEvent) {
	const element = e.currentTarget as HTMLElement;
	element.classList.add("over");
}

export function handleDragLeave(e: DragEvent) {
	const element = e.currentTarget as HTMLElement;
	element.classList.remove("over");
}

function handleDrop(e: DragEvent) {
	const dropNode = e.currentTarget as HTMLElement;
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
			position: position as 0 | 1 | 2,
			defaultDirection: defaultDirection as 1 | -1 | null
		}));
		handleRender();
	}
}

export function handleDragEnd(e: DragEvent) {
	const element = e.currentTarget as HTMLElement;
	element.removeAttribute("style");
}

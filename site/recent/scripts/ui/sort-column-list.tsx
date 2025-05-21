// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import type {AppProps, AppState, SortColumn} from "../app-state/app-state";
import type {DataStore} from "@repo/lib/state/state";
import {updateSortColumnsAction} from "../app-state/sort-columns-reducer";

let store: DataStore<AppState>;
let handleRender: () => void;
let dragNode: HTMLElement;

export function SortColumnList(props: AppProps): JSX.Element {
	//--! TODO: scope duct-tape
	store = props.store;
	handleRender = props.handleRender;

	return (
		<div id="sort-columns">
			<div class="strong">Sort:</div>
			{store.getState().sortColumns.map(SortColumnButton)}
		</div>
	);
}

function SortColumnButton(sortColumn: SortColumn, colIndex: number): JSX.Element {
	const sortLevels = ["primary", "secondary", "tertiary"];
	const sortDirection = sortColumn.direction == 1 ? "ascending" : "descending";

	return (
		<button
			onClick={handleClick}
			onDragStart={handleDragStart}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onDragEnd={handleDragEnd}
			class={`sort-column ${sortDirection} ${sortLevels[colIndex]} strong`}
			draggable="true"
			data-sort-on={sortColumn.name}
			data-position={colIndex}
		>
			{sortColumn.label}
			<span aria-hidden="true" />
		</button>
	);
}

function handleClick(e: MouseEvent) {
	const buttonNode = e.currentTarget as HTMLButtonElement;
	const name = String(buttonNode.dataset.sortOn);
	const label = String(buttonNode.textContent).trim();
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

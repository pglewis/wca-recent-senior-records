import type {SortColumn} from "./app-state";
import {type AppAction, AppActionTypes, SortColumnsChangedAction} from "./app-actions.js";

export type SortChange = {
	position: 0 | 1 | 2
	name: string
	label: string
	defaultDirection: 1 | -1 | null
}

export function updateSortColumnsAction(newSort: SortChange): SortColumnsChangedAction {
	return {
		type: AppActionTypes.sortColumnsChanged,
		payload: newSort
	};
}

export function sortColumnsReducer(sortColumns: SortColumn[] = [], action: AppAction): SortColumn[] {
	const {type, payload} = action;

	switch (type) {
		case AppActionTypes.sortColumnsChanged: {
			return sortColumnsChanged(sortColumns, payload);
		}
	}

	return sortColumns;
}

function sortColumnsChanged(sortColumns: SortColumn[], newSort: SortChange): SortColumn[] {
	const sortColumnsCopy = [...sortColumns];
	const oldPosition = sortColumns.findIndex(f => f.name === newSort.name);

	// Completely new sort column?  Drop it in the new position
	if (oldPosition < 0) {
		sortColumnsCopy[newSort.position] = {
			name: newSort.name,
			label: newSort.label,
			direction: newSort.defaultDirection || 1
		};
		return sortColumnsCopy;
	}

	// Existing column, same position? Toggle the sort direction
	if (oldPosition === newSort.position) {
		sortColumnsCopy[newSort.position].direction *= -1;
		return sortColumnsCopy;
	}

	// All that's left is an existing column being repositioned
	sortColumnsCopy.splice(oldPosition, 1);
	sortColumnsCopy.splice(newSort.position, 0, sortColumns[oldPosition]);
	return sortColumnsCopy;
}

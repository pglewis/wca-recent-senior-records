// @ts-check

/**
 * @typedef {import("../state/state").SortColumn} SortColumn
 * @typedef {import("./sort-columns-reducer").SortChange} SortChange
 */
import {ACTION_TYPES} from "./actions.js";

/** @type {import("./sort-columns-reducer").updateSortColumnsAction} updateSortColumnsAction */
export const updateSortColumnsAction = newSort => {
	return {
		type: ACTION_TYPES.sortColumnsChanged,
		payload: newSort
	};
};

/** @type {import("./sort-columns-reducer").sortColumnsReducer} sortColumnsReducer */
export const sortColumnsReducer = (sortColumns = [], action) => {
	const {type, payload} = action;

	switch (type) {
		case ACTION_TYPES.sortColumnsChanged: {
			return sortColumnsChanged(sortColumns, payload);
		}
	}

	return sortColumns;
};

/**
 * @param   {SortColumn[]} sortColumns
 * @param   {SortChange}   newSort
 * @returns {SortColumn[]}
 */
function sortColumnsChanged(sortColumns, newSort) {
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


const ACTION_TYPES = {
	sortColumnsChanged: "sortColumnsChanged",
};

/**
 * @param {SortChange} newSort
 *
 * @returns {Action}
 */
export const updateSortColumnsAction = newSort => {
	return {
		type: ACTION_TYPES.sortColumnsChanged,
		payload: newSort
	};
};

/**
 *
 * @param {SortColumn[]} sortColumns
 * @param {Action} action
 *
 * @returns {SortColumn[]}
 */
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
 *
 * @param {SortColumn[]} sortColums
 * @param {SortChange}   newSort
 *
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

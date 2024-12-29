const ACTION_TYPES = {
	topNChanged: "topNChanged",
	recentInDaysChanged: "recentInDaysChanged",
	searchFilterChanged: "searchFilterChanged",
};

/**
 *
 * @param {number} newValue
 *
 * @returns {Action}
 */
export const setTopNAction = newValue => {
	return {
		type: ACTION_TYPES.topNChanged,
		payload: newValue
	};
};

/**
 *
 * @param {number} newValue
 *
 * @returns {Action}
 */
export const setRecentInDaysAction = newValue => {
	return {
		type: ACTION_TYPES.recentInDaysChanged,
		payload: newValue
	};
};

/**
 * @param {string} searchText
 *
 * @returns {Action}
 */
export const setSearchFilterAction = searchText => {
	return {
		type: ACTION_TYPES.searchFilterChanged,
		payload: searchText
	};
};

/**
 * @type {ReducerCB}
 *
 * @param {Filters}  filters
 * @param {Action}   action
 *
 * @returns {Filters}  filters
 */
export const filtersReducer = (filters = {}, action) => {
	const {type, payload} = action;

	switch (type) {
		case ACTION_TYPES.topNChanged:
			return {...filters, topN: payload};

		case ACTION_TYPES.recentInDaysChanged:
			return {...filters, recentInDays: payload};

		case ACTION_TYPES.searchFilterChanged:
			return {...filters, search: payload};
	}

	return filters;
};

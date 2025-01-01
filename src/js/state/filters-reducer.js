const ACTION_TYPES = {
	topNChanged: "topNChanged",
	recentInDaysChanged: "recentInDaysChanged",
	searchFilterChanged: "searchFilterChanged",
};

/** @type {import("./filters-reducer").setTopNAction} setTopNAction */
export const setTopNAction = newValue => {
	return {
		type: ACTION_TYPES.topNChanged,
		payload: newValue
	};
};

/** @type {import("./filters-reducer").setRecentInDaysAction} setRecentInDaysAction */
export const setRecentInDaysAction = newValue => {
	return {
		type: ACTION_TYPES.recentInDaysChanged,
		payload: newValue
	};
};

/** @type {import("./filters-reducer").setSearchFilterAction} setSearchFilterAction */
export const setSearchFilterAction = searchText => {
	return {
		type: ACTION_TYPES.searchFilterChanged,
		payload: searchText
	};
};

/** @type {import("./filters-reducer").filtersReducer} filtersReducer */
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

// @ts-check
import {initialState} from "./state.js";
import {ACTION_TYPES} from "./actions.js";

/** @type {import("./filters-reducer").setTopNAction} */
export const setTopNAction = newValue => {
	return {
		type: ACTION_TYPES.topNChanged,
		payload: newValue
	};
};

/** @type {import("./filters-reducer").setRecentInDaysAction} */
export const setRecentInDaysAction = newValue => {
	return {
		type: ACTION_TYPES.recentInDaysChanged,
		payload: newValue
	};
};

/** @type {import("./filters-reducer").setSearchFilterAction} */
export const setSearchFilterAction = searchText => {
	return {
		type: ACTION_TYPES.searchFilterChanged,
		payload: searchText
	};
};

/** @type {import("./filters-reducer").filtersReducer} */
export const filtersReducer = (filters = initialState.filters, action) => {
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

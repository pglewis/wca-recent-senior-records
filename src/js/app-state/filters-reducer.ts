import {initialState, Filters} from "./app-state";
import {
	AppActionTypes,
	AppAction,
	TimeFrameChangedAction,
	SearchFilterChangedAction,
	TopNChangedAction
} from "./app-actions";

export function setTopNAction(newValue: number): TopNChangedAction {
	return {
		type: AppActionTypes.topNChanged,
		payload: newValue
	};
}

export function setRecentInDaysAction(newValue: number): TimeFrameChangedAction {
	return {
		type: AppActionTypes.timeFrameChanged,
		payload: newValue
	};
}

export function setSearchFilterAction(searchText: string): SearchFilterChangedAction {
	return {
		type: AppActionTypes.searchFilterChanged,
		payload: searchText
	};
}

export function filtersReducer(filters: Filters = initialState.filters, action: AppAction): Filters {
	const {type, payload} = action;

	switch (type) {
		case AppActionTypes.topNChanged:
			return {...filters, topN: payload};

		case AppActionTypes.timeFrameChanged:
			return {...filters, timeFrame: payload};

		case AppActionTypes.searchFilterChanged:
			return {...filters, search: payload};
	}

	return filters;
};

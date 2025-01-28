import {initialState, type Filters} from "./app-state";
import {
	AppActionTypes,
	AppAction,
	SearchFilterChangedAction,
	TopNChangedAction,
	TimeFrameChangedAction,
	RegionChangedAction,
} from "./app-actions";

export function setTopNAction(newValue: number): TopNChangedAction {
	return {
		type: AppActionTypes.topNChanged,
		payload: newValue
	};
}

export function setTimeFrameAction(newValue: number): TimeFrameChangedAction {
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

export function setRegionAction(region: Filters["region"]): RegionChangedAction {
	return {
		type: AppActionTypes.regionChanged,
		payload: region
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

		case AppActionTypes.regionChanged:
			return {...filters, region: payload};

	}

	return filters;
};

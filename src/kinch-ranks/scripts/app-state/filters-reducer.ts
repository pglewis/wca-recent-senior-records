import {EventRanking} from "../../../common/scripts/rankings-snapshot";
import {
	AppActionTypes,
	AppAction,
	FiltersSetAction,
	AgeFilterChangedAction,
	WCAIDFilterChangedAction,
	RegionFilterChangedAction,
	PageFilterChangedAction,
	SearchFilterChangedAction,
	RowsPerPageFilterChangedAction,
} from "./app-actions";
import {AppFilters, initialState} from "./app-state";

export function setFiltersAction(filters: AppFilters): FiltersSetAction {
	return {
		type: AppActionTypes.filtersSet,
		payload: filters
	};
}

export function setAgeFilterAction(age: EventRanking["age"]): AgeFilterChangedAction {
	return {
		type: AppActionTypes.ageFilterChanged,
		payload: age
	};
}

export function setWCAIDFilterAction(wcaid: string | undefined): WCAIDFilterChangedAction {
	return {
		type: AppActionTypes.wcaidFilterChanged,
		payload: wcaid
	};
}

export function setRegionFilterAction(region: string): RegionFilterChangedAction {
	return {
		type: AppActionTypes.regionFilterChanged,
		payload: region
	};
}

export function setPageFilterAction(page: number): PageFilterChangedAction {
	return {
		type: AppActionTypes.pageFilterChanged,
		payload: page
	};
}

export function setSearchFilterAction(search: string): SearchFilterChangedAction {
	return {
		type: AppActionTypes.searchFilterChanged,
		payload: search
	};
}

export function setRowsPerPageFilterAction(rowsPerPage: number): RowsPerPageFilterChangedAction {
	return {
		type: AppActionTypes.rowsPerPageFilterChanged,
		payload: rowsPerPage
	};
}

export function filtersReducer(filters: AppFilters = initialState.filters, action: AppAction): AppFilters {
	const {type, payload} = action;

	switch (type) {
		case AppActionTypes.filtersSet: {
			return {...filters, ...payload};
		}
		case AppActionTypes.ageFilterChanged: {
			return {...filters, age: payload};
		}
		case AppActionTypes.wcaidFilterChanged: {
			return {...filters, wcaid: payload};
		}
		case AppActionTypes.regionFilterChanged: {
			return {...filters, region: payload};
		}
		case AppActionTypes.pageFilterChanged: {
			return {...filters, page: payload};
		}
		case AppActionTypes.searchFilterChanged: {
			return {...filters, searchTerm: payload};
		}
		case AppActionTypes.rowsPerPageFilterChanged: {
			return {...filters, rowsPerPage: payload};
		}
	}

	return filters;
};

import {initialState, type Filters} from "./app-state";
import {
	AppActionTypes,
	AppAction,
	SearchFilterChangedAction,
	TopNChangedAction,
	TimeFrameChangedAction,
	RankingTypeChangedAction,
	ContinentFilterChangedAction,
	CountryFilterChangedAction,
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

export function setRankingTypeAction(rankingType: Filters["rankingType"]): RankingTypeChangedAction {
	return {
		type: AppActionTypes.rankingTypeChanged,
		payload: rankingType
	};
}

export function setContinentFilterAction(continent: Filters["continent"]): ContinentFilterChangedAction {
	return {
		type: AppActionTypes.continentFilterChanged,
		payload: continent
	};
}

export function setCountryFilterAction(country: Filters["country"]): CountryFilterChangedAction {
	return {
		type: AppActionTypes.countryFilterChanged,
		payload: country
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

		case AppActionTypes.rankingTypeChanged:
			return {...filters, rankingType: payload};

		case AppActionTypes.continentFilterChanged:
			return {...filters, continent: payload};

		case AppActionTypes.countryFilterChanged:
			return {...filters, country: payload};
	}

	return filters;
};

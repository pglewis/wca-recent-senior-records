import {initialState, type Filters} from "./app-state";
import {
	AppActionTypes,
	AppAction,
	EventFilterChangedAction,
	EventTypeFilterChangedAction,
	AgeFilterChangedAction,
	SearchFilterChangedAction,
	ContinentFilterChangedAction,
	CountryFilterChangedAction,
	TopNChangedAction,
	RankingTypeChangedAction,
	TimeFrameChangedAction,
} from "./app-actions";
import {EventRanking, WCAEvent} from "../rankings-snapshot";

export function setSearchFilterAction(searchText: string): SearchFilterChangedAction {
	return {
		type: AppActionTypes.searchFilterChanged,
		payload: searchText
	};
}

export function setEventFilterAction(eventID: WCAEvent["id"]): EventFilterChangedAction {
	return {
		type: AppActionTypes.eventFilterChanged,
		payload: eventID
	};
}

export function setEventTypeFilterAction(eventType: EventRanking["type"] | ""): EventTypeFilterChangedAction {
	return {
		type: AppActionTypes.eventTypeFilterChanged,
		payload: eventType
	};
}

export function setAgeFilterAction(age: EventRanking["age"]): AgeFilterChangedAction {
	return {
		type: AppActionTypes.ageFilterChanged,
		payload: age
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

export function setTopNAction(newValue: number): TopNChangedAction {
	return {
		type: AppActionTypes.topNChanged,
		payload: newValue
	};
}
export function setRankingTypeAction(rankingType: Filters["rankingType"]): RankingTypeChangedAction {
	return {
		type: AppActionTypes.rankingTypeChanged,
		payload: rankingType
	};
}

export function setTimeFrameAction(newValue: number): TimeFrameChangedAction {
	return {
		type: AppActionTypes.timeFrameChanged,
		payload: newValue
	};
}

export function filtersReducer(filters: Filters = initialState.filters, action: AppAction): Filters {
	const {type, payload} = action;

	switch (type) {
		case AppActionTypes.searchFilterChanged:
			return {...filters, search: payload};

		case AppActionTypes.eventFilterChanged:
			return {...filters, event: payload};

		case AppActionTypes.eventTypeFilterChanged:
			return {...filters, eventType: payload};

		case AppActionTypes.ageFilterChanged:
			return {...filters, age: payload};

		case AppActionTypes.continentFilterChanged:
			return {...filters, continent: payload};

		case AppActionTypes.countryFilterChanged:
			return {...filters, country: payload};

		case AppActionTypes.topNChanged:
			return {...filters, topN: payload};

		case AppActionTypes.rankingTypeChanged:
			return {...filters, rankingType: payload};

		case AppActionTypes.timeFrameChanged:
			return {...filters, timeFrame: payload};
	}

	return filters;
};

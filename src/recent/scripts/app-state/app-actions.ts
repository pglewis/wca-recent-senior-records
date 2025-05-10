import type {UnknownAction} from "../../../common/scripts/state/actions";
import type {EventRanking, RankingsSnapshot, WCAEvent} from "../../../common/scripts/rankings-snapshot";
import type {SortChange} from "./sort-columns-reducer";
import type {Rankings, Filters, SortColumn, UIState} from "./app-state";

export enum AppActionTypes {
	rankingsDataSet = "rankingsDataSet",

	searchFilterChanged = "searchFilterChanged",
	eventFilterChanged = "eventFilterChanged",
	eventTypeFilterChanged = "eventTypeFilterChanged",
	ageFilterChanged = "ageFilterChanged",
	continentFilterChanged = "continentFilterChanged",
	countryFilterChanged = "countryFilterChanged",
	topNChanged = "topNChanged",
	rankingTypeChanged = "rankingTypeChanged",
	timeFrameChanged = "timeFrameChanged",

	rankingsFiltered = "rankingsFiltered",
	resultsSorted = "resultsSorted",
	sortColumnsChanged = "sortColumnsChanged",
	uiStateSet = "uiStateSet",
};

export interface RankingsDataSetAction extends UnknownAction {
	type: AppActionTypes.rankingsDataSet
	payload: RankingsSnapshot
}
export interface SearchFilterChangedAction extends UnknownAction {
	type: AppActionTypes.searchFilterChanged
	payload: string
}

export interface EventFilterChangedAction extends UnknownAction {
	type: AppActionTypes.eventFilterChanged
	payload: WCAEvent["id"] | ""
}

export interface EventTypeFilterChangedAction extends UnknownAction {
	type: AppActionTypes.eventTypeFilterChanged
	payload: EventRanking["type"] | ""
}

export interface AgeFilterChangedAction extends UnknownAction {
	type: AppActionTypes.ageFilterChanged
	payload: EventRanking["age"] | ""
}

export interface ContinentFilterChangedAction extends UnknownAction {
	type: AppActionTypes.continentFilterChanged
	payload: Filters["continent"] | ""
}

export interface CountryFilterChangedAction extends UnknownAction {
	type: AppActionTypes.countryFilterChanged
	payload: Filters["country"] | ""
}

export interface TopNChangedAction extends UnknownAction {
	type: AppActionTypes.topNChanged
	payload: number
}

export interface RankingTypeChangedAction extends UnknownAction {
	type: AppActionTypes.rankingTypeChanged
	payload: Filters["rankingType"]
}

export interface TimeFrameChangedAction extends UnknownAction {
	type: AppActionTypes.timeFrameChanged
	payload: number
}

export interface RankingsFilteredAction extends UnknownAction {
	type: AppActionTypes.rankingsFiltered
	payload: {
		rankings: Rankings
		filters: Filters
	}
}

export interface ResultsSortedAction extends UnknownAction {
	type: AppActionTypes.resultsSorted
	payload: {
		sortColumns: SortColumn[]
		rankingType: Filters["rankingType"]
	}
}

export interface SortColumnsChangedAction extends UnknownAction {
	type: AppActionTypes.sortColumnsChanged
	payload: SortChange
}

export interface UIStateSetAction extends UnknownAction {
	type: AppActionTypes.uiStateSet
	payload: UIState
}

export type AppAction =
	RankingsDataSetAction

	| SearchFilterChangedAction
	| EventFilterChangedAction
	| EventTypeFilterChangedAction
	| AgeFilterChangedAction
	| ContinentFilterChangedAction
	| CountryFilterChangedAction
	| TopNChangedAction
	| RankingTypeChangedAction
	| TimeFrameChangedAction

	| RankingsFilteredAction
	| ResultsSortedAction
	| SortColumnsChangedAction
	| UIStateSetAction

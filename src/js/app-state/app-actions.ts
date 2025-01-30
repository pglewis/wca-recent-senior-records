import type {UnknownAction} from "../state/actions";
import type {RankingsSnapshot} from "../rankings-snapshot";
import type {SortChange} from "./sort-columns-reducer";
import type {Rankings, Filters, SortColumn, UIState} from "./app-state";

export enum AppActionTypes {
	rankingsDataSet = "rankingsDataSet",
	searchFilterChanged = "searchFilterChanged",
	topNChanged = "topNChanged",
	timeFrameChanged = "timeFrameChanged",
	rankingTypeChanged = "rankingTypeChanged",
	continentFilterChanged = "continentFilterChanged",
	countryFilterChanged = "countryFilterChanged",
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

export interface TopNChangedAction extends UnknownAction {
	type: AppActionTypes.topNChanged
	payload: number
}

export interface TimeFrameChangedAction extends UnknownAction {
	type: AppActionTypes.timeFrameChanged
	payload: number
}

export interface RankingTypeChangedAction extends UnknownAction {
	type: AppActionTypes.rankingTypeChanged
	payload: Filters["rankingType"]
}

export interface ContinentFilterChangedAction extends UnknownAction {
	type: AppActionTypes.continentFilterChanged
	payload: Filters["continent"]
}

export interface CountryFilterChangedAction extends UnknownAction {
	type: AppActionTypes.countryFilterChanged
	payload: Filters["country"]
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
	| TopNChangedAction
	| TimeFrameChangedAction
	| SearchFilterChangedAction
	| RankingTypeChangedAction
	| ContinentFilterChangedAction
	| CountryFilterChangedAction
	| RankingsFilteredAction
	| ResultsSortedAction
	| SortColumnsChangedAction
	| UIStateSetAction

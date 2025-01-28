import type {UnknownAction} from "../state/actions";
import type {RankingsSnapshot} from "../rankings-snapshot";
import type {SortChange} from "./sort-columns-reducer";
import type {Rankings, Filters, SortColumn, UIState} from "./app-state";

export enum AppActionTypes {
	searchFilterChanged = "searchFilterChanged",
	topNChanged = "topNChanged",
	timeFrameChanged = "timeFrameChanged",
	regionChanged = "regionChanged",
	rankingsDataSet = "rankingsDataSet",
	rankingsFiltered = "rankingsFiltered",
	resultsSorted = "resultsSorted",
	sortColumnsChanged = "sortColumnsChanged",
	uiStateSet = "uiStateSet",
};

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

export interface RegionChangedAction extends UnknownAction {
	type: AppActionTypes.regionChanged
	payload: Filters["region"]
}

export interface RankingsDataSetAction extends UnknownAction {
	type: AppActionTypes.rankingsDataSet
	payload: RankingsSnapshot
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
		region: Filters["region"]
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
	TopNChangedAction
	| TimeFrameChangedAction
	| SearchFilterChangedAction
	| RegionChangedAction
	| RankingsDataSetAction
	| RankingsFilteredAction
	| ResultsSortedAction
	| SortColumnsChangedAction
	| UIStateSetAction

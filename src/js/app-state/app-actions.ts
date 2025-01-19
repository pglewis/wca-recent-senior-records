import {type UnknownAction} from "../state/actions";
import {type RankingsSnapshot} from "../rankings-snapshot";
import {type SortChange} from "./sort-columns-reducer";
import {type Filters, type SortColumn} from "./app-state";

export enum AppActionTypes {
	topNChanged = "topNChanged",
	timeFrameChanged = "timeFrameChanged",
	searchFilterChanged = "searchFilterChanged",
	rankingsDataSet = "rankingsDataSet",
	rankingsFiltered = "rankingsFiltered",
	resultsSorted = "resultsSorted",
	sortColumnsChanged = "sortColumnsChanged",
};

export interface TopNChangedAction extends UnknownAction {
	type: AppActionTypes.topNChanged;
	payload: number;
}

export interface TimeFrameChangedAction extends UnknownAction {
	type: AppActionTypes.timeFrameChanged;
	payload: number;
}

export interface SearchFilterChangedAction extends UnknownAction {
	type: AppActionTypes.searchFilterChanged;
	payload: string;
}

export interface RankingsDataSetAction extends UnknownAction {
	type: AppActionTypes.rankingsDataSet;
	payload: RankingsSnapshot;
}

export interface RankingsFilteredAction extends UnknownAction {
	type: AppActionTypes.rankingsFiltered;
	payload: {
		rankingsData: RankingsSnapshot,
		filters: Filters
	};
}

export interface ResultsSortedAction extends UnknownAction {
	type: AppActionTypes.resultsSorted;
	payload: SortColumn[];
}

export interface SortColumnsChangedAction extends UnknownAction {
	type: AppActionTypes.sortColumnsChanged;
	payload: SortChange;
}

export type AppAction =
	TopNChangedAction
	| TimeFrameChangedAction
	| SearchFilterChangedAction
	| RankingsDataSetAction
	| RankingsFilteredAction
	| ResultsSortedAction
	| SortColumnsChangedAction

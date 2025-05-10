import {RankingsSnapshot, EventRanking} from "../../../common/scripts/rankings-snapshot";
import type {UnknownAction} from "../../../common/scripts/state/actions";
import {TopRank} from "../types";
import {AppFilters, Rankings} from "./app-state";

export enum AppActionTypes {
	rankingsDataSet = "rankingsDataSet",
	topRanksSet = "topRanksSet",
	updateKinchRanks = "updateKinchRanks",
	filtersSet = "filtersSet",
	ageFilterChanged = "ageFilterChanged",
	wcaidFilterChanged = "wcaidFilterChanged",
	searchFilterChanged = "searchFilterChanged",
	regionFilterChanged = "regionFilterChanged",
	pageFilterChanged = "pageFilterChanged",
	rowsPerPageFilterChanged = "rowsPerPageFilterChanged",
};

export interface RankingsDataSetAction extends UnknownAction {
	type: AppActionTypes.rankingsDataSet
	payload: RankingsSnapshot
}

export interface TopRanksSetAction extends UnknownAction {
	type: AppActionTypes.topRanksSet,
	payload: Rankings
}

export interface KinchRanksUpdatedAction extends UnknownAction {
	type: AppActionTypes.updateKinchRanks,
	payload: {
		rankings: Rankings,
		topRanks: TopRank[],
		filters: AppFilters,
	}
}

export interface FiltersSetAction extends UnknownAction {
	type: AppActionTypes.filtersSet,
	payload: AppFilters
}
export interface AgeFilterChangedAction extends UnknownAction {
	type: AppActionTypes.ageFilterChanged,
	payload: EventRanking["age"]
}
export interface WCAIDFilterChangedAction extends UnknownAction {
	type: AppActionTypes.wcaidFilterChanged,
	payload: string | undefined
}
export interface RegionFilterChangedAction extends UnknownAction {
	type: AppActionTypes.regionFilterChanged,
	payload: string
}
export interface PageFilterChangedAction extends UnknownAction {
	type: AppActionTypes.pageFilterChanged,
	payload: number
}

export interface SearchFilterChangedAction extends UnknownAction {
	type: AppActionTypes.searchFilterChanged,
	payload: string
}
export interface RowsPerPageFilterChangedAction extends UnknownAction {
	type: AppActionTypes.rowsPerPageFilterChanged,
	payload: number
}

export type AppAction =
	RankingsDataSetAction
	| TopRanksSetAction
	| KinchRanksUpdatedAction
	| FiltersSetAction
	| AgeFilterChangedAction
	| WCAIDFilterChangedAction
	| RegionFilterChangedAction
	| PageFilterChangedAction
	| SearchFilterChangedAction
	| RowsPerPageFilterChangedAction;

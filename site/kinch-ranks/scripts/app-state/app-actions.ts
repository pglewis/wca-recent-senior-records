import {ExtendedRankingsData, EventRanking} from "@repo/lib/types/rankings-snapshot";
import type {UnknownAction} from "@repo/lib/state/actions";
import {TopRank} from "@repo/lib/types/kinch-types";
import {AppFilters} from "./app-state";

export enum AppActionTypes {
	rankingsDataSet = "rankingsDataSet",

	topRanksSet = "topRanksSet",
	updateKinchRanks = "updateKinchRanks",

	allFiltersSet = "allFiltersSet",
	ageFilterChanged = "ageFilterChanged",
	wcaidFilterChanged = "wcaidFilterChanged",
	regionFilterChanged = "regionFilterChanged",
	pageFilterChanged = "pageFilterChanged",
	rowsPerPageFilterChanged = "rowsPerPageFilterChanged",

	controlStateChanged = "controlStateChanged",
	searchTermChanged = "searchTermChanged",
	eventScoreSortChanged = "eventScoreSortChanged",
};

export interface RankingsDataSetAction extends UnknownAction {
	type: AppActionTypes.rankingsDataSet,
	payload: ExtendedRankingsData,
};

export interface TopRanksSetAction extends UnknownAction {
	type: AppActionTypes.topRanksSet,
	payload: TopRank[],
};

export interface KinchRanksUpdatedAction extends UnknownAction {
	type: AppActionTypes.updateKinchRanks,
	payload: {
		rankings: ExtendedRankingsData,
		topRanks: TopRank[],
		filters: AppFilters,
	},
};

export interface AllFiltersSetAction extends UnknownAction {
	type: AppActionTypes.allFiltersSet,
	payload: AppFilters,

};
export interface AgeFilterChangedAction extends UnknownAction {
	type: AppActionTypes.ageFilterChanged,
	payload: EventRanking["age"],

};
export interface WCAIDFilterChangedAction extends UnknownAction {
	type: AppActionTypes.wcaidFilterChanged,
	payload: string | undefined,
};

export interface RegionFilterChangedAction extends UnknownAction {
	type: AppActionTypes.regionFilterChanged,
	payload: string,
};
export interface PageFilterChangedAction extends UnknownAction {
	type: AppActionTypes.pageFilterChanged,
	payload: number,
};

export interface RowsPerPageFilterChangedAction extends UnknownAction {
	type: AppActionTypes.rowsPerPageFilterChanged,
	payload: number,
};

export interface ControlStateChangedAction extends UnknownAction {
	type: AppActionTypes.controlStateChanged,
	payload: {
		scrollX: number,
		scrollY: number,
		activeID: string | null,
		selectionStart: number | null,
		selectionEnd: number | null,
		selectionDirection: "forward" | "backward" | "none" | null,
	},
};

export interface SearchFilterChangedAction extends UnknownAction {
	type: AppActionTypes.searchTermChanged,
	payload: string,
};

export interface EventScoreSortChangedAction extends UnknownAction {
	type: AppActionTypes.eventScoreSortChanged,
	payload: "event" | "score",
};

export type AppAction =
	RankingsDataSetAction
	| TopRanksSetAction
	| KinchRanksUpdatedAction
	| AllFiltersSetAction
	| AgeFilterChangedAction
	| WCAIDFilterChangedAction
	| RegionFilterChangedAction
	| PageFilterChangedAction
	| RowsPerPageFilterChangedAction
	| ControlStateChangedAction
	| SearchFilterChangedAction
	| EventScoreSortChangedAction
;

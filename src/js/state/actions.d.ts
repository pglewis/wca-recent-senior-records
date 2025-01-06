// @ts-check
import {RankingsSnapshot} from "../rankings-snapshot";
import {SortChange} from "./sort-columns-reducer";
import {Filters, SortColumn} from "./state";

type ActionTypes = {
	readonly topNChanged: "topNChanged",
	readonly recentInDaysChanged: "recentInDaysChanged",
	readonly searchFilterChanged: "searchFilterChanged",
	readonly rankingsDataSet: "rankingsDataSet",
	readonly rankingsFiltered: "rankingsFiltered",
	readonly resultsSorted: "resultsSorted",
	readonly sortColumnsChanged: "sortColumnsChanged",
};

interface TopNChangedAction {
	type: ActionTypes["topNChanged"];
	payload: number;
}

interface RecentInDaysChangedAction {
	type: ActionTypes["recentInDaysChanged"];
	payload: number;
}

interface SearchFilterChangedAction {
	type: ActionTypes["searchFilterChanged"];
	payload: string;
}

interface RankingsDataSetAction {
	type: ActionTypes["rankingsDataSet"];
	payload: RankingsSnapshot;
}

interface RankingsFilteredAction {
	type: ActionTypes["rankingsFiltered"];
	payload: {
		rankingsData: RankingsSnapshot,
		filters: Filters
	};
}

interface ResultsSortedAction {
	type: ActionTypes["resultsSorted"];
	payload: SortColumn[];
}

interface SortColumnsChangedAction {
	type: ActionTypes["sortColumnsChanged"];
	payload: SortChange;
}

export type Action =
	TopNChangedAction
	| RecentInDaysChangedAction
	| SearchFilterChangedAction
	| RankingsDataSetAction
	| RankingsFilteredAction
	| ResultsSortedAction
	| SortColumnsChangedAction

export declare const ACTION_TYPES: ActionTypes;

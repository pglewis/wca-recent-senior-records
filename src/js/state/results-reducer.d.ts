// @ts-check
import {RankingsSnapshot} from "../rankings-snapshot";
import {Action, RankingsFilteredAction, ResultsSortedAction} from "./actions";
import {Filters, ResultRowData, SortColumn} from "./state";

export declare function filterRankingsAction(rankingsData: RankingsSnapshot, filters: Filters): RankingsFilteredAction;
export declare function sortResultsAction(sortColumns: SortColumn[]): ResultsSortedAction;
export declare function resultsReducer(results: ResultRowData[] , action: Action): ResultRowData[];

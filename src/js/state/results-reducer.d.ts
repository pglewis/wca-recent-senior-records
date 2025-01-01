import {RankingsSnapshot} from "../rankings-snapshot";
import {Action, Filters, ResultRowData, SortColumn} from "./state";

export declare function filterRankingsAction(rankingsData: RankingsSnapshot, filters: Filters): Action
export declare function sortResultsAction(sortColumns: SortColumn[]): Action
export declare function resultsReducer(results: ResultRowData[] , action: Action): ResultRowData[]

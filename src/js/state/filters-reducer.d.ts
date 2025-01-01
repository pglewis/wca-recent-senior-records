import {Action, Filters} from "./state";

export declare function setTopNAction(newValue: number): Action
export declare function setRecentInDaysAction(newValue: number): Action
export declare function setSearchFilterAction(searchText: string): Action
export declare function filtersReducer(filters: Filters | {}, action: Action): Action

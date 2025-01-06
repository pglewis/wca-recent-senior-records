// @ts-check
import {Filters} from "./state";
import {Action, RecentInDaysChangedAction, SearchFilterChangedAction, TopNChangedAction} from "./actions";

export declare function setTopNAction(newValue: Filters["topN"]): TopNChangedAction;
export declare function setRecentInDaysAction(newValue: Filters["recentInDays"]): RecentInDaysChangedAction;
export declare function setSearchFilterAction(searchText: Filters["search"]): SearchFilterChangedAction;
export declare function filtersReducer(filters: Filters, action: Action): Filters;

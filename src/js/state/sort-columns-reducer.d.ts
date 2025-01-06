// @ts-check
import {Action, SortColumnsChangedAction} from '../state/actions';
import {SortColumn} from './state';

type SortChange = {
	position: 0 | 1 | 2
	name: string
	label: string
	defaultDirection: 1 | -1 | null
}

export declare function updateSortColumnsAction(newSort: SortChange): SortColumnsChangedAction;
export declare function sortColumnsReducer(sortColumns: SortColumn[], action: Action): SortColumn[];

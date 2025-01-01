import {SortColumn, Action} from '../state/state';

type SortChange = {
	position: 0 | 1 | 2
	name: string
	label: string
	defaultDirection: 1 | -1 | null
}

export declare function updateSortColumnsAction(newSort: SortChange): Action
export declare function sortColumnsReducer(sortColumns: SortColumn[], action: Action): SortColumn[]

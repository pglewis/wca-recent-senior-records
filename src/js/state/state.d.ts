import {RankingsSnapshot} from "../rankings-snapshot"

export type AppState = {
	rankings: Rankings
	results: ResultRowData[] | null
	filters: Filters
	sortColumns: SortColumn[]
}

export type Rankings = {
	/** date/time string of the data snapshot in UTC */
	lastUpdated: string | null
	data: RankingsSnapshot
}

export type ResultRowData = {
	/** e.g. 333bf */
	eventID: string
	/** e.g. 3x3x3 Blindfolded */
	eventName: string
	/** single, average */
	eventType: 'single' | 'average'
	eventyFormat: 'time' | 'number' | 'multi'
	age: string  // should this be number?
	/** competition start date, UTC YYYY-MM-DD */
	date: string
	/** estimated numeric rank (considers missing records) */
	rank: string  // should this be number?
	/** persons.name */
	name: string  // if there is an actual type "Person", this could be Person['name'] to make the relation clearer and more robust
	/** persons.id */
	wcaID: string // see above
	/** result as time, number, multi */
	result: 'time'
	/** competition full name */
	compName: string
	/** web ID for linking */
	compWebID: string
	/** 2 character country code */
	compCountry: string  // this could also be set as a strict type, i.e. 'AF' | 'AL' | 'DZ' | ...
}

export type Filters = {
	topN: number
	search: string | null
	recentInDays: number
}

export type SortColumn = {
	name: string
	label: string
	direction: number
}

export type Action = {
	/** Unique identifier for the action */
	type: string
	/** context-specific data */
	payload?: unknown
}

export type DataStore = {
	/** Returns the current state */
	getState: GetStateCB
	/** Dispatch an action, all state mutations go through here */
	dispatch: DispatchCB
}

export type GetStateCB = () => AppState
export type DispatchCB = (action: Action) => void
export type ReducerCB = (state: AppState, action: Action) => AppState

export declare const initialState: AppState
export declare function rootReducer(state: AppState, action: Action): AppState
export declare function createStore(initialState: AppState, reducer: ReducerCB): DataStore

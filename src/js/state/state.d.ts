// @ts-check
import {Action} from "./actions";
import {
	RankingsSnapshot,
	Person,
	WCAEvent,
	EventRanking,
	Competition,
	Rank,
} from "../rankings-snapshot";

export type AppState = {
	rankings: Rankings
	results: ResultRowData[]
	filters: Filters
	sortColumns: SortColumn[]
}

export type Rankings = {
	/** date/time string of the data snapshot in UTC */
	lastUpdated: string | null
	data: RankingsSnapshot | {}
}

export type ResultRowData = {
	/** eg 333bf */
	eventID: WCAEvent["id"]

	/** eg 3x3x3 Blindfolded */
	eventName: WCAEvent["name"]

	/** The format used for the result */
	eventFormat: WCAEvent["format"]

	/** single, average */
	eventType: EventRanking["type"]

	/** The age group for this ranking (40, 50, 60, ...) */
	age: EventRanking["age"]

	/** competition start date, UTC YYYY-MM-DD */
	date: Competition["startDate"]

	/** estimated numeric rank (considers missing records) */
	rank: Rank["rank"]

	/** Competitor's full name */
	name: Person["name"]

	/** Competitor's WCA ID */
	wcaID: Person["id"]

	/**
	 * Event result. Format may be a time duration, number (for fewest moves
	 * competition), or multi ("X/Y in MM:SS") as specified by the event format
 	 */
	result: Rank["best"]

	/** Competition full name */
	compName: Competition["name"]

	/** Competition web ID for linking */
	compWebID: Competition["webId"]

	/** 2 character country code */
	compCountry: Competition["country"]
}

export type Filters = {
	topN: number
	search: string
	recentInDays: number
}

export type SortColumn = {
	name: string
	label: string
	direction: number
}

export type DataStore = {
	/** Returns the current state */
	getState: GetStateCB
	/** Dispatch an action, all state mutations go through here */
	dispatch: DispatchCB
}

export type GetStateCB = () => AppState;
export type DispatchCB = (action: Action) => void;
export type ReducerCB = (state: AppState, action: Action) => AppState;

export declare const initialState: AppState;
export declare function rootReducer(state: AppState, action: Action): AppState;
export declare function createStore(initialState: AppState, reducer: ReducerCB): DataStore;

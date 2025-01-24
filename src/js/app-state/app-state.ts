import type {
	RankingsSnapshot,
	Person,
	WCAEvent,
	EventRanking,
	Competition,
	Rank,
} from "../rankings-snapshot";
import {type DataStore, type ReducersMapObject, combineReducers} from "../state/state";

import {filtersReducer} from "./filters-reducer";
import {rankingsReducer} from "./rankings-reducer";
import {resultsReducer} from "./results-reducer";
import {sortColumnsReducer} from "./sort-columns-reducer";

export interface AppProps {
	store: DataStore<AppState>,

	/** Callback to trigger a re-render of the UI */
	handleRender: () => void
}

export type AppState = {
	rankings: Rankings
	results: ResultRow[]
	filters: Filters
	sortColumns: SortColumn[]
}

export type Rankings = {
	/** date/time string of the data snapshot in UTC */
	lastUpdated: string
	data: RankingsSnapshot
}

export type ResultRow = {
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
	search: string
	topN: number

	/** In days */
	timeFrame: number
}

export type SortColumn = {
	name: string
	label: string
	direction: number
}

export const initialState: AppState = {
	rankings: {
		lastUpdated: "",
		data: {} as RankingsSnapshot
	},
	results: [],
	filters: {
		topN: 10,
		timeFrame: 30,
		search: "",
	},
	sortColumns: [
		{name: "date", label: "Date", direction: -1},
		{name: "rank", label: "Rank", direction: 1},
		{name: "event", label: "Event", direction: 1}
	],
};

export const rootReducer = combineReducers<AppState>({
	rankings: rankingsReducer,
	results: resultsReducer,
	filters: filtersReducer,
	sortColumns: sortColumnsReducer,
} as ReducersMapObject<AppState>);

import type {
	RankingsSnapshot,
	Person,
	WCAEvent,
	EventRanking,
	Competition,
	Rank,
	Continent,
	Country,
} from "../rankings-snapshot";
import {combineReducers, type DataStore, type ReducersMapObject} from "../state/state";
import {filtersReducer} from "./filters-reducer";
import {rankingsReducer} from "./rankings-reducer";
import {resultsReducer} from "./results-reducer";
import {sortColumnsReducer} from "./sort-columns-reducer";
import {uiReducer} from "./ui-reducer";

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
	uiState: UIState
}

export interface Rankings {
	/** date/time string of the data snapshot in UTC */
	lastUpdated: string
	data: RankingsSnapshot
	personIDToIndex: {[key: string]: number}
	competitionIDToIndex: {[key: number]: number}
	continentIDToIndex: {[key: string]: number}
	countryIDToIndex: {[key: string]: number}
	activeRegions: {
		continents: Set<Continent["id"]>
		countries: Set<Country["id"]>
	}
}

export interface ResultRow {
	event: WCAEvent

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

	continent: Continent
	country: Country

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

export interface Filters {
	search: string
	event: WCAEvent["id"] | ""
	eventType: EventRanking["type"] | ""
	age: EventRanking["age"] | ""
	continent: Continent["id"] | ""
	country: Country["id"] | ""
	topN: number

	/** world, continent, or national ranking */
	rankingType: "wr" | "cr" | "nr"

	/** In days */
	timeFrame: number
}

export interface SortColumn {
	name: string
	label: string
	direction: number
}
export interface UIState {
	scrollX: number
	scrollY: number
	activeID: string | null
	selectionStart?: number | null
	selectionEnd?: number | null
	selectionDirection?: "forward" | "backward" | "none" | null
}

export const initialState: AppState = {
	rankings: {
		lastUpdated: "",
		data: {} as RankingsSnapshot,
		competitionIDToIndex: {},
		personIDToIndex: {},
		continentIDToIndex: {},
		countryIDToIndex: {},
		activeRegions: {continents: new Set(), countries: new Set()},
	},
	results: [],
	filters: {
		search: "",
		event: "",
		eventType: "",
		age: "",
		continent: "",
		country: "",
		topN: 10,
		rankingType: "wr",
		timeFrame: 30,
	},
	sortColumns: [
		{name: "date", label: "Date", direction: -1},
		{name: "rank", label: "Rank", direction: 1},
		{name: "event", label: "Event", direction: 1},
	],
	uiState: {
		scrollX: 0,
		scrollY: 0,
		activeID: null,
	}
};

export const rootReducer = combineReducers<AppState>({
	rankings: rankingsReducer,
	results: resultsReducer,
	filters: filtersReducer,
	sortColumns: sortColumnsReducer,
	uiState: uiReducer,
} as ReducersMapObject<AppState>);

import {EventRanking, RankingsSnapshot, ExtendedRankingsData} from "@repo/lib/types/rankings-snapshot";
import {combineReducers, type DataStore, type ReducersMapObject} from "@repo/lib/state/state";
import {rankingsReducer} from "./rankings-reducer";
import {KinchRank, TopRank} from "../types";
import {dataReducer} from "./data-reducer";
import {filtersReducer} from "./filters-reducer";
import {UIStateReducer} from "./ui-state-reducer";

export interface AppProps {
	store: DataStore<AppState>,

	/** Callback to trigger a re-render of the UI */
	handleRender: () => void
};

export type AppData = {
	topRanks: TopRank[],
	kinchRanks: KinchRank[],
};

export interface AppFilters {
	age: EventRanking["age"],
	region: string,
	page: number,
	rowsPerPage: number,
	wcaid?: string,
};

export interface UIState {
	controlState: {
		scrollX: number,
		scrollY: number,
		activeID: string | null,
		selectionStart: number | null,
		selectionEnd: number | null,
		selectionDirection: "forward" | "backward" | "none" | null,

	},
	userInputState: {
		searchTerm: string,
		eventScoreSort: "event" | "score",
	}
};

export type AppState = {
	rankings: ExtendedRankingsData,
	data: AppData,
	filters: AppFilters,
	uiState: UIState,
};

export const initialState: AppState = {
	rankings: {
		lastUpdated: "",
		data: {} as RankingsSnapshot,
		competitionIDToIndex: {},
		personIDToIndex: {},
		continentIDToIndex: {},
		countryIDToIndex: {},
		activeRegions: {continents: [], countries: []},
	},
	data: {
		kinchRanks: [],
		topRanks: [],
	},
	filters: {
		wcaid: undefined,
		age: 40,
		region: "world",
		page: 1,
		rowsPerPage: 25,
	},
	uiState: {
		controlState: {
			scrollX: window.scrollX,
			scrollY: window.scrollY,
			activeID: null,
			selectionStart: null,
			selectionEnd: null,
			selectionDirection: null,
		},
		userInputState: {
			searchTerm: "",
			eventScoreSort: "event",
		},
	},
};

export const rootReducer = combineReducers<AppState>({
	rankings: rankingsReducer,
	data: dataReducer,
	filters: filtersReducer,
	uiState: UIStateReducer,
} as ReducersMapObject<AppState>);

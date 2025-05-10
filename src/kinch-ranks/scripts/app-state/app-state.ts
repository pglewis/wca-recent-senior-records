import {Continent, Country, EventRanking, RankingsSnapshot} from "../../../common/scripts/rankings-snapshot";
import {combineReducers, type DataStore, type ReducersMapObject} from "../../../common/scripts/state/state";
import {KinchRank, TopRank} from "../types";
import {rankingsReducer} from "./rankings-reducer";
import {dataReducer} from "./data-reducer";
import {filtersReducer} from "./filters-reducer";

export interface AppProps {
	store: DataStore<AppState>,

	/** Callback to trigger a re-render of the UI */
	handleRender: () => void
};

export interface Rankings {
	/** date/time string of the data snapshot in UTC */
	lastUpdated: string,
	data: RankingsSnapshot,
	personIDToIndex: {[key: string]: number},
	competitionIDToIndex: {[key: number]: number},
	continentIDToIndex: {[key: string]: number},
	countryIDToIndex: {[key: string]: number},
	activeRegions: {
		continents: Set<Continent["id"]>
		countries: Set<Country["id"]>
	}
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
	searchTerm: string,
};

export type AppState = {
	rankings: Rankings,
	data: AppData,
	filters: AppFilters,
};

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
	data: {
		kinchRanks: [],
		topRanks: [],
	},
	filters: {
		wcaid: undefined,
		age: 40,
		region: "World",
		page: 1,
		rowsPerPage: 25,
		searchTerm: "",
	}
};

export const rootReducer = combineReducers<AppState>({
	rankings: rankingsReducer,
	data: dataReducer,
	filters: filtersReducer,
} as ReducersMapObject<AppState>);

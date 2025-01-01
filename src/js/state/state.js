/**
 * @typedef {import("./state").AppState} AppState
 * @typedef {import("./state").GetStateCB} GetStateCB
 * @typedef {import("./state").DispatchCB} DispatchCB
 */
import {rankingsReducer} from "./rankings-reducer.js";
import {resultsReducer} from "./results-reducer.js";
import {filtersReducer} from "./filters-reducer.js";
import {sortColumnsReducer} from "./sort-columns-reducer.js";

/** @type {AppState} */
export const initialState = {
	rankings: {
		lastUpdated: null,
		data: null
	},
	results: [],
	filters: {
		topN: 10,
		recentInDays: 30,
		search: null,
	},
	sortColumns: [
		{name: "date", label: "Date", direction: -1},
		{name: "rank", label: "Rank", direction: 1},
		{name: "event", label: "Event", direction: 1}
	],
};

/** @type {import("./state").rootReducer} */
export const rootReducer = combineReducers({
	rankings: rankingsReducer,
	results: resultsReducer,
	filters: filtersReducer,
	sortColumns: sortColumnsReducer,
});

/** @type {import("./state").createStore} createStore */
export const createStore = (initialState, reducer) => {
	let state = initialState;

	/** @type {GetStateCB} */
	function getState() {
		return state;
	}

	/** @type {DispatchCB} */
	function dispatch(action) {
		state = reducer(getState(), action);
	}

	return {
		getState,
		dispatch,
	};
};

/**
 * @param   {*}      reducers
 * @returns {object}
 */
function combineReducers(reducers) {
	return function(state = {}, action) {
		const newState = {};
		for (const slice in reducers) {
			newState[slice] = reducers[slice](state[slice], action);
		}
		return newState;
	};
}

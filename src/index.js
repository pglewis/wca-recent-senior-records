// @ts-check

/** @typedef {import("./js/rankings-snapshot").RankingsSnapshot} RankingsSnapshot */
import {initialState, rootReducer, createStore} from "./js/state/state.js";
import {setRankingsDataAction} from "./js/state/rankings-reducer.js";
import {filterRankingsAction, sortResultsAction} from "./js/state/results-reducer.js";
import {createRoot} from "./js/components/create-root.js";
import {App, Loading, ErrorMessage} from "./js/components/app.js";

const appRoot = createRoot("#app");
/** @type {RankingsSnapshot|null} */
// @ts-ignore
const rankingsSnapshot = window.rankings || null;
if (!rankingsSnapshot) {
	appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
	throw new Error("Missing rankings data");
}

const store = createStore(initialState, rootReducer);
store.dispatch(setRankingsDataAction(rankingsSnapshot));
render();

function render() {
	try {
		const state = store.getState();
		const activeID = document.activeElement?.id || null;

		appRoot.render(Loading());

		// @ts-ignore
		store.dispatch(filterRankingsAction(state.rankings.data, state.filters));
		store.dispatch(sortResultsAction(state.sortColumns));

		appRoot.render(App({store: store, handleRender: render}));

		if (activeID) {
			document.getElementById(activeID)?.focus();
		}
	} catch (error) {
		appRoot.render(ErrorMessage(error));
		throw error;
	}
}

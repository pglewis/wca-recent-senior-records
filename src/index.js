import {initialState, rootReducer, createStore} from "./js/state/state.js";
import {filterRankingsAction, sortResultsAction}	from "./js/state/results-reducer.js";
import {createRoot, App, Loading, ErrorMessage} from "./js/components/app.js";
import {setRankingsDataAction} from "./js/state/rankings-reducer.js";

/** @type {Root} */
const appRoot = createRoot("#app");

/** @type {RankingsSnapshot} This is the only direct reference to the global */
const rankingsData = window.rankings || null;
if (!rankingsData) {
	appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
	throw "Missing rankings data";
}

const store = createStore(initialState, rootReducer);
store.dispatch(setRankingsDataAction(rankingsData));
render();

function render() {
	try {
		const state = store.getState();
		const activeID = document.activeElement?.id || null;

		appRoot.render(Loading());

		store.dispatch(filterRankingsAction(state.rankings.data, state.filters));
		store.dispatch(sortResultsAction(state.sortColumns));

		appRoot.render(App({store: store, handleRender: render}));

		if (activeID) {
			document.getElementById(activeID).focus();
		}
	} catch (error) {
		appRoot.render(ErrorMessage(error));
		throw error;
	}
}

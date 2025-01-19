import {type RankingsSnapshot} from "./js/rankings-snapshot";
import {createStore} from "./js/state/state";
import {initialState, rootReducer} from "./js/app-state/app-state";
import {setRankingsDataAction} from "./js/app-state/rankings-reducer";
import {filterRankingsAction, sortResultsAction} from "./js/app-state/results-reducer";
import {createRoot} from "./js/components/create-root";
import {App, Loading, ErrorMessage} from "./js/components/app";

declare global {interface Window {rankings: RankingsSnapshot | undefined;}}

const rankingsSnapshot = window.rankings;
const appRoot = createRoot("#app");

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

		store.dispatch(filterRankingsAction(state.rankings.data, state.filters));
		store.dispatch(sortResultsAction(state.sortColumns));

		appRoot.render(App({store: store, handleRender: render}));

		if (activeID) {
			document.getElementById(activeID)?.focus();
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			appRoot.render(ErrorMessage(error.message));
		}
		throw error;
	}
}

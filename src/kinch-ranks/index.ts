import type {RankingsSnapshot} from "../common/scripts/rankings-snapshot";
import {createStore} from "../common/scripts/state/state";
import {initialState} from "./scripts/app-state/app-state";
import {appReducer} from "./scripts/app-state/app-reducer";
import {setRankingsDataAction} from "./scripts/app-state/rankings-reducer";
import {setTopRanksAction} from "./scripts/app-state/data-reducer";
import {createRoot} from "../common/scripts/ui/create-root";
import {ErrorMessage} from "./scripts/ui/error-message";
import {Renderer} from "./scripts/renderer";

// Setup the root for all UI display
const appRoot = createRoot("#app");

// Get the rankings data
let rankingsSnapshot: RankingsSnapshot;
const url = "../data/senior-rankings.json";
const response = await fetch(url);
try {
	if (!response.ok) {
		appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
		throw new Error(`Fetch response: ${response.statusText}`);
	}

	rankingsSnapshot = await response.json();
} catch (error) {
	appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
	throw error;
}

// Create the data store and do initial, one-time calculations
const store = createStore(initialState, appReducer);
store.dispatch(setRankingsDataAction(rankingsSnapshot));
store.dispatch(setTopRanksAction(store.getState().rankings));

// Render the UI
const renderer = new Renderer(store, appRoot);
renderer.renderFromURLState();

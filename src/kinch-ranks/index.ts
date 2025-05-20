import {ExtendedRankingsData} from "../common/scripts/rankings-snapshot";
import {createStore} from "../common/scripts/state/state";
import {initialState} from "./scripts/app-state/app-state";
import {appReducer} from "./scripts/app-state/app-reducer";
import {setRankingsDataAction} from "./scripts/app-state/rankings-reducer";
import {setTopRanksAction} from "./scripts/app-state/data-reducer";
import {createRoot} from "../common/scripts/ui/create-root";
import {Renderer} from "./scripts/renderer";
import {ErrorMessage} from "./scripts/ui/error-message";

// Setup the root for all UI display
const appRoot = createRoot("#app");

// Get the rankings data
let rankings: ExtendedRankingsData;
const url = "../data/senior-rankings.json";
const response = await fetch(url);
try {
	if (!response.ok) {
		appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
		throw new Error(`Fetch response: ${response.statusText}`);
	}

	rankings = await response.json();
	// JSON.stringify doesn't work with Sets, convert the JSON arrays back to Sets
} catch (error) {
	appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
	throw error;
}

// Create the data store and do initial, one-time calculations
const store = createStore(initialState, appReducer);
store.dispatch(setRankingsDataAction(rankings));
store.dispatch(setTopRanksAction(store.getState().rankings));

// Render the UI
const renderer = new Renderer(store, appRoot);
renderer.renderFromURLState();

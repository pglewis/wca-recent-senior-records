import type {RankingsSnapshot} from "../common/scripts/rankings-snapshot";
import {createRoot} from "../common/scripts/ui/create-root";
import {ErrorMessage} from "./scripts/ui/error-message";

import {createStore} from "../common/scripts/state/state";
import {initialState} from "./scripts/app-state/app-state";
import {appReducer} from "./scripts/app-state/app-reducer";
import {setRankingsDataAction} from "./scripts/app-state/rankings-reducer";
import {Renderer} from "./scripts/renderer";
import {setTopRanksAction} from "./scripts/app-state/data-reducer";

// Setup the root for all UI display
const appRoot = createRoot("#app");

// Make sure the rankings data snapshot exists
declare global {interface Window {rankings: RankingsSnapshot | undefined}}
const rankingsSnapshot = window.rankings;
if (!rankingsSnapshot) {
	appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
	throw new Error("Missing rankings data");
}

// Create the data store and do initial, one-time calculations
const store = createStore(initialState, appReducer);
store.dispatch(setRankingsDataAction(rankingsSnapshot));
store.dispatch(setTopRanksAction(store.getState().rankings));

// Render the UI
const renderer = new Renderer(store, appRoot);
renderer.setFiltersFromURLState();

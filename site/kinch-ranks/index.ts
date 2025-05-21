import {ExtendedRankingsData} from "@repo/lib/types/rankings-snapshot";
import {TopRank} from "@repo/lib/types/kinch-types";
import {createStore} from "@repo/lib/state/state";
import {initialState} from "./scripts/app-state/app-state";
import {appReducer} from "./scripts/app-state/app-reducer";
import {setRankingsDataAction} from "./scripts/app-state/rankings-reducer";
import {setTopRanksAction} from "./scripts/app-state/data-reducer";
import {createRoot} from "@repo/lib/ui/create-root";
import {Renderer} from "./scripts/renderer";
import {ErrorMessage} from "./scripts/ui/error-message";

// Setup the root for all UI display
const appRoot = createRoot("#app");

// Get the rankings and top ranks data
let rankings: ExtendedRankingsData;
let topRanks: TopRank[];
const [rankingsResponse, topRanksResponse] = await Promise.all([
	fetch("../data/senior-rankings.json"),
	fetch("../data/topranks.json")
]);

try {
	// In practice, ghpages doesn't seem to return 404s and will return the index.html instead
	if (!rankingsResponse.ok || !topRanksResponse.ok) {
		appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
		throw new Error(`rankingsResponse: ${rankingsResponse.statusText}, topRanksResponse: ${topRanksResponse.statusText}`);
	}

	[rankings, topRanks] = await Promise.all([
		rankingsResponse.json(),
		topRanksResponse.json(),
	]);
} catch (error) {
	appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
	throw error;
}

// Create the data store and do initial, one-time calculations
const store = createStore(initialState, appReducer);
store.dispatch(setRankingsDataAction(rankings));
store.dispatch(setTopRanksAction(topRanks));

// Render the UI
const renderer = new Renderer(store, appRoot);
renderer.renderFromURLState();

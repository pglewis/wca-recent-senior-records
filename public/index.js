import {createStore, reducer, searchRankingsAction, sortResultsAction} from "./js/state/state.js";
import {createRoot, App, Loading, ErrorMessage} from "./js/components/app.js";

/** @type {GlobalRankingsSnapshot} This is the only direct reference to the global */
const rankingData = window.rankings || null;

/** @type {Root} */
const root = createRoot("#app");
if (!rankingData) {
	root.render(ErrorMessage("The ranking data is missing, try back in a bit."));
	console.error(`rankings: ${window.rankings}`);
	throw "";
}

/** @type {AppState} */
const initialState = {
	results: null,
	dataLastUpdated: rankingData.refreshed,
	topN: 10,
	recentInDays: 30,
	sortColumns: [
		{name: "date", label: "Date", direction: -1},
		{name: "rank", label: "Rank", direction: 1},
		{name: "event", label: "Event", direction: 1}
	],
};

const store = createStore(initialState, reducer);
render();

function render() {
	try {
		root.render(Loading());

		if (!store.getState().results) {
			store.dispatch(searchRankingsAction(rankingData));
			store.dispatch(sortResultsAction());
		}
		root.render(App({store: store, handleRender: render}));
	} catch (error) {
		root.render(ErrorMessage(error));

		// Re-throw the error uncaught to stop execution and
		// get line number information in the console
		throw error;
	}
}

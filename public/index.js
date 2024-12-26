import {
	createStore,
	reducer,
	searchRankingsAction,
	filterResultsAction,
	sortResultsAction,
} from "./js/state/state.js";

import {createRoot, App, Loading, ErrorMessage} from "./js/components/app.js";

/** @type {Root} */
const root = createRoot("#app");

/** @type {GlobalRankingsSnapshot} This is the only direct reference to the global */
const rankingsData = window.rankings || null;
if (!rankingsData) {
	root.render(ErrorMessage("The ranking data is missing, try back in a bit."));
	console.error(`rankings: ${window.rankings}`);
	throw "";
}

/** @type {AppState} */
const initialState = {
	results: null,
	dataLastUpdated: rankingsData.refreshed,
	topN: 10,
	recentInDays: 30,
	filters: {
		search: null,
	},
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
		const activeID = document.activeElement.id || null;

		root.render(Loading());

		store.dispatch(searchRankingsAction(rankingsData));
		store.dispatch(filterResultsAction());
		store.dispatch(sortResultsAction());

		root.render(App({store: store, handleRender: render}));

		if (activeID) {
			document.getElementById(activeID).focus();
		}
	} catch (error) {
		root.render(ErrorMessage(error));

		// Re-throw the error uncaught to stop execution and
		// get line number information in the console
		throw error;
	}
}

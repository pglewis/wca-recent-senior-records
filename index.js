import { createStore, reducer, searchRankingsAction, sortResultsAction } from "./js/state.js";
import { createRoot, App, Loading, ErrorMessage } from "./js/app.js";

/** @type {GlobalRankingsSnapshot} */
const rankingData = rankings; // This is the only direct reference to the global

/** @type {AppState} */
const initialState = {
	results: null,
	dataLastUpdated: rankingData.refreshed,
	topN: 10,
	recentInDays: 30,
	sortProp: "date",
	sortDirection: -1,
};

/** @type {Root} */
const root = createRoot('#app');
const store = createStore(initialState, reducer);
render();

function render() {
	try {
		const { results, sortProp } = store.getState();

		root.render(Loading());

		if (!results) {
			store.dispatch(searchRankingsAction(rankingData));

			if (sortProp) {
				store.dispatch(sortResultsAction(sortProp));
			}
		}

		root.render(App({ store: store, handleRender: render }));
	}
	catch (error) {
		root.render(ErrorMessage(`Something went wrong: ${error}`));

		// Re-throw the error uncaught to stop execution and
		// get line number information in the console
		throw error;
	}
}

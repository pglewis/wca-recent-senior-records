import {ExtendedRankingsData} from "@repo/lib/types/rankings-snapshot";
import {createStore} from "@repo/lib/state/state";
import {initialState, UIState} from "./scripts/app-state/app-state";
import {appReducer} from "./scripts/app-state/app-reducer";
import {setUIStateAction} from "./scripts/app-state/ui-reducer";
import {filterRankingsAction, sortResultsAction} from "./scripts/app-state/results-reducer";
import {createRoot} from "@repo/lib/ui/create-root";
import {App, Loading, ErrorMessage} from "./scripts/ui/app";
import {setRankingsDataAction} from "./scripts/app-state/rankings-reducer";

const appRoot = createRoot("#app");

let rankings: ExtendedRankingsData;
const url = "../data/senior-rankings.json";
const response = await fetch(url);
try {
	if (!response.ok) {
		appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
		throw new Error(`Fetch response: ${response.statusText}`);
	}

	rankings = await response.json();
} catch (error) {
	appRoot.render(ErrorMessage("The rankings data is missing, try back in a bit."));
	throw error;
}

const store = createStore(initialState, appReducer);
store.dispatch(setRankingsDataAction(rankings));
render();

/*
 *
 */
function render() {
	try {
		const state = store.getState();
		store.dispatch(setUIStateAction(getUIState()));

		appRoot.render(Loading());

		store.dispatch(filterRankingsAction(state.rankings, state.filters));
		store.dispatch(sortResultsAction(state.sortColumns, state.filters.rankingType));
		appRoot.render(App({store: store, handleRender: render}));

		setUIState(state.uiState);

	} catch (error: unknown) {
		if (error instanceof Error) {
			appRoot.render(ErrorMessage(error.message));
		}
		throw error;
	}
}

/*
 *
 */
function getUIState(): UIState {
	const uiState = initialState.uiState;

	uiState.scrollX = window.scrollX;
	uiState.scrollY = window.scrollY;

	uiState.activeID = document.activeElement?.id || null;

	const search = document.getElementById("search-input") as HTMLInputElement;
	uiState.selectionStart = search?.selectionStart;
	uiState.selectionEnd = search?.selectionEnd;
	uiState.selectionDirection = search?.selectionDirection;

	return uiState;
}

/*
 *
 */
function setUIState(uiState: UIState): void {
	if (uiState.activeID) {
		document.getElementById(uiState.activeID)?.focus();
	}

	if (uiState.activeID === "search-input") {
		const search = document.getElementById("search-input") as HTMLInputElement;
		search.selectionStart = uiState?.selectionStart || null;
		search.selectionEnd = uiState?.selectionEnd || null;
		search.selectionDirection = uiState?.selectionDirection || "none";
	}

	window.scroll(uiState.scrollX, uiState.scrollY);
}

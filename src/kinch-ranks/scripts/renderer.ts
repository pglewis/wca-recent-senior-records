import {DataStore} from "../../common/scripts/state/state";
import {AppState, initialState, UIState} from "./app-state/app-state";
import {Root} from "../../common/scripts/ui/create-root";
import {App} from "./ui/app";
import {ErrorMessage} from "./ui/error-message";
import {Loading} from "./ui/loading";
import {setKinchRanksAction} from "./app-state/data-reducer";
import {getURLState} from "./url-state";
import {setAllFiltersAction} from "./app-state/filters-reducer";
import {setControlStateAction} from "./app-state/ui-state-reducer";

export class Renderer {
	private store: DataStore<AppState>;
	private appRoot: Root;

	/*
	 *
	 */
	constructor(store: DataStore<AppState>, appRoot: Root) {
		this.store = store;
		this.appRoot = appRoot;
		window.addEventListener("popstate", this.renderFromURLState.bind(this));
	}

	/*
	 *
	 */
	render() {
		const {store, appRoot} = this;

		try {
			store.dispatch(setControlStateAction(this.getCurrentControlState()));
			appRoot.render(Loading());

			const {rankings, data, filters} = this.store.getState();
			store.dispatch(setKinchRanksAction(rankings, data.topRanks, filters));

			appRoot.render(App({store: store, handleRender: this.render.bind(this)}));
			this.setControlState(store.getState().uiState.controlState);
		} catch (error: unknown) {
			if (error instanceof Error) {
				appRoot.render(ErrorMessage(error.message));
			}
			throw error;
		}
	};

	/*
	 *
	 */
	renderFromURLState() {
		const urlFilters = getURLState();

		this.store.dispatch(setAllFiltersAction({...initialState.filters, ...urlFilters}));
		this.render();
	}

	/*
	 *
	 */
	private getCurrentControlState(): UIState["controlState"] {
		const search = document.getElementById("search-input") as HTMLInputElement;

		return {
			scrollX: window.scrollX,
			scrollY: window.scrollY,
			activeID: document.activeElement?.id || null,
			selectionStart: search?.selectionStart,
			selectionEnd: search?.selectionEnd,
			selectionDirection: search?.selectionDirection,
		};
	}

	/*
	 *
	 */
	private setControlState(controlState: UIState["controlState"]): void {
		if (controlState.activeID) {
			document.getElementById(controlState.activeID)?.focus();
		}

		if (controlState.activeID === "search-input") {
			const search = document.getElementById("search-input") as HTMLInputElement;
			search.selectionStart = controlState.selectionStart;
			search.selectionEnd = controlState.selectionEnd;
			search.selectionDirection = controlState.selectionDirection || "none";
		}

		window.scroll(controlState.scrollX, controlState.scrollY);
	}
}

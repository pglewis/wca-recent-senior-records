import {DataStore} from "../../common/scripts/state/state";
import {AppState, initialState} from "./app-state/app-state";
import {Root} from "../../common/scripts/ui/create-root";
import {App} from "./ui/app";
import {ErrorMessage} from "./ui/error-message";
import {Loading} from "./ui/loading";
import {setKinchRanksAction} from "./app-state/data-reducer";
import {getURLState} from "./url-state";
import {setFiltersAction} from "./app-state/filters-reducer";

export class Renderer {
	private store: DataStore<AppState>;
	private appRoot: Root;
	private scrollX!: number;
	private scrollY!: number;
	private activeID: string | null = null;
	private selectionStart: number | null = null;
	private selectionEnd: number | null = null;
	private selectionDirection: "forward" | "backward" | "none" | null = null;

	/*
	 *
	 */
	constructor(store: DataStore<AppState>, appRoot: Root) {
		this.store = store;
		this.appRoot = appRoot;
		window.addEventListener("popstate", this.setFiltersFromURLState.bind(this));
	}

	/*
	 *
	 */
	render() {
		try {
			this.getUIState();
			this.appRoot.render(Loading());

			const {rankings, data, filters} = this.store.getState();
			this.store.dispatch(setKinchRanksAction(rankings, data.topRanks, filters));

			this.appRoot.render(App({store: this.store, handleRender: this.render.bind(this)}));
			this.setUIState();
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.appRoot.render(ErrorMessage(error.message));
			}
			throw error;
		}
	};

	/*
	 *
	 */
	setFiltersFromURLState() {
		const urlFilters = getURLState();

		this.store.dispatch(setFiltersAction({...initialState.filters, ...urlFilters}));
		this.render();
	}

	/*
	 *
	 */
	private getUIState(): void {
		this.scrollX = window.scrollX;
		this.scrollY = window.scrollY;

		this.activeID = document.activeElement?.id || null;

		const search = document.getElementById("search-input") as HTMLInputElement;
		this.selectionStart = search?.selectionStart;
		this.selectionEnd = search?.selectionEnd;
		this.selectionDirection = search?.selectionDirection;
	}

	/*
	 *
	 */
	private setUIState(): void {
		if (this.activeID) {
			document.getElementById(this.activeID)?.focus();
		}

		if (this.activeID === "search-input") {
			const search = document.getElementById("search-input") as HTMLInputElement;
			search.selectionStart = this.selectionStart;
			search.selectionEnd = this.selectionEnd;
			search.selectionDirection = this.selectionDirection || "none";
		}

		window.scroll(this.scrollX, this.scrollY);
	}
}

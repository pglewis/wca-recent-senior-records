import {initialState} from "./app-state/app-state";

export interface URLState {
	wcaid?: string;
	age: number;
	region: string;
	page: number;
}

const defaults: URLState = {
	wcaid: initialState.filters.wcaid,
	age: initialState.filters.age,
	region: initialState.filters.region,
	page: initialState.filters.page,
};

/*
 *
 */
export function getURLState(): URLState {
	const params = new URLSearchParams(window.location.search);

	const getParam = (name: keyof URLState): string | undefined => {
		return params.get(name) || undefined;
	};

	return {
		age: Number(getParam("age") || defaults.age),
		region: getParam("region") || defaults.region,
		page: Number(getParam("page")) || defaults.page,
		wcaid: getParam("wcaid") || defaults.wcaid,
	};
}

/*
 *
 */
export function updateURLState(newState: Partial<URLState>): void {
	const url = new URL(window.location.href);
	const params = url.searchParams;

	const setParam = (key: keyof URLState, value: string | number | undefined, condition: boolean = true) => {
		// Omit if missing, set to default, or matching a custom condition
		if (value !== undefined && value !== defaults[key] && condition) {
			params.set(key, value.toString());
		} else {
			params.delete(key);
		}
	};

	setParam("wcaid", newState.wcaid);
	setParam("age", newState.age);
	setParam("region", newState.region);
	setParam("page", newState.page, newState.wcaid === undefined); // Page is meaningless on personal ranks pages

	const newURL = `${url.pathname}${params.toString() ? "?" + params.toString() : ""}`;
	window.history.pushState({}, "", newURL);
}

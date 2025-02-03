import {type UnknownAction, type Action} from "./actions";

type Dispatch<A extends Action> = (action: A) => void;

type StateSlice = unknown

export type State = {
	[key: string]: StateSlice
}

export type Reducer<S extends StateSlice, A extends Action = UnknownAction> =
	(state: S | undefined, action: A) => S;

export type ReducersMapObject<S extends State> = {
	[slice in keyof S]: Reducer<S[slice]>
};

export function combineReducers<S extends State>(reducers: ReducersMapObject<S>): Reducer<S> {
	return (state: S = {} as S, action: UnknownAction): S => {
		const newState: S = {} as S;

		for (const slice in reducers) {
			const reducer = reducers[slice];
			newState[slice] = reducer(state[slice], action);
		}

		return newState;
	};
}

export type DataStore<S = unknown, A extends Action = UnknownAction> = {
	/** Returns the current state */
	getState(): S

	/** Dispatch an action, all state mutations go through here */
	dispatch: Dispatch<A>
}

export function createStore<S>(initialState: S, reducer: Reducer<S>): DataStore<S> {
	let state = initialState;

	function getState(): S {
		return state;
	}

	function dispatch(action: UnknownAction) {
		state = reducer(getState(), action);
	}

	return {
		getState,
		dispatch,
	};
};

import {type UnknownAction} from "@repo/lib/state/actions";
import {initialState, rootReducer, type AppState} from "./app-state";

export function appReducer(state: AppState = initialState, action: UnknownAction): AppState {
	return rootReducer(state, action);
}

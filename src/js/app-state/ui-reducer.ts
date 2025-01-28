import {AppActionTypes, type AppAction, type UIStateSetAction} from "./app-actions";
import {initialState, type UIState} from "./app-state";

export function setUIStateAction(uiState: UIState): UIStateSetAction {
	return {
		type: AppActionTypes.uiStateSet,
		payload: uiState
	};
}

export function uiReducer(ui: UIState = initialState.uiState, action: AppAction): UIState {
	const {type, payload} = action;

	switch (type) {
		case AppActionTypes.uiStateSet:
			return payload;
	}

	return ui;
};

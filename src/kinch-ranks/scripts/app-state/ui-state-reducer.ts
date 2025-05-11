import {
	AppActionTypes,
	AppAction,
	ControlStateChangedAction,
	SearchFilterChangedAction,
	EventScoreSortChangedAction,
} from "./app-actions";

import {UIState, initialState} from "./app-state";

export function setControlStateAction(controlState: UIState["controlState"]): ControlStateChangedAction {
	return {
		type: AppActionTypes.controlStateChanged,
		payload: controlState,
	};
}

export function setSearchFilterAction(search: string): SearchFilterChangedAction {
	return {
		type: AppActionTypes.searchTermChanged,
		payload: search
	};
}

export function setEventScoreSortAction(eventScoreSort: UIState["userInputState"]["eventScoreSort"]): EventScoreSortChangedAction {
	return {
		type: AppActionTypes.eventScoreSortChanged,
		payload: eventScoreSort,
	};
}

export function UIStateReducer(uiState: UIState = initialState.uiState, action: AppAction): UIState {
	switch (action.type) {
		case AppActionTypes.controlStateChanged: {
			return {
				...uiState,
				controlState: {
					...uiState.controlState,
					...action.payload,
				},
			};
		}
		case AppActionTypes.searchTermChanged: {
			return {
				...uiState,
				userInputState: {
					...uiState.userInputState,
					searchTerm: action.payload,
				},
			};
		}
		case AppActionTypes.eventScoreSortChanged: {
			return {
				...uiState,
				userInputState: {
					...uiState.userInputState,
					eventScoreSort: action.payload,
				},
			};
		}
	}

	return uiState;
}
import {ExtendedRankingsData} from "../../../common/scripts/rankings-snapshot";
import {AppAction, AppActionTypes, RankingsDataSetAction} from "./app-actions";
import {initialState} from "./app-state";

export function setRankingsDataAction(rankings: ExtendedRankingsData): RankingsDataSetAction {
	return {
		type: AppActionTypes.rankingsDataSet,
		payload: rankings
	};
};

export function rankingsReducer(rankings: ExtendedRankingsData = initialState.rankings, action: AppAction): ExtendedRankingsData {
	const {type, payload} = action;

	switch (type) {
		case AppActionTypes.rankingsDataSet: {
			return payload;
		}
	}

	return rankings;
};

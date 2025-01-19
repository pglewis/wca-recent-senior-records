import {type RankingsSnapshot} from "../rankings-snapshot";
import {AppAction, AppActionTypes, RankingsDataSetAction} from "./app-actions";
import {initialState, Rankings} from "./app-state";

export function setRankingsDataAction(rankingsSnapshot: RankingsSnapshot): RankingsDataSetAction {
	return {
		type: AppActionTypes.rankingsDataSet,
		payload: rankingsSnapshot
	};
};

export function rankingsReducer(rankings: Rankings = initialState.rankings, action: AppAction): Rankings {
	const {type, payload} = action;

	switch (type) {
		case AppActionTypes.rankingsDataSet: {
			return {lastUpdated: payload.refreshed, data: payload};
		}
	}

	return rankings;
};

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
			return {
				lastUpdated: payload.refreshed,
				data: payload,
				competitionIDToIndex: buildCompetitionLookup(payload),
				personIDToIndex: buildPersonLookup(payload),
				continentIDToIndex: buildContinentLookup(payload),
				countryIDToIndex: buildCountryLookup(payload)
			};
		}
	}

	return rankings;
};

function buildCompetitionLookup(rankings: RankingsSnapshot) {
	const lookup: Rankings["competitionIDToIndex"] = {};

	for (const [index, competition] of rankings.competitions.entries()) {
		lookup[competition.id] = index;
	}

	return lookup;
}

function buildPersonLookup(rankings: RankingsSnapshot) {
	const lookup: Rankings["personIDToIndex"] = {};

	for (const [index, person] of rankings.persons.entries()) {
		lookup[person.id] = index;
	}

	return lookup;
}

function buildContinentLookup(rankings: RankingsSnapshot) {
	const lookup: Rankings["continentIDToIndex"] = {};

	for (const [index, continent] of rankings.continents.entries()) {
		lookup[continent.id] = index;
	}

	return lookup;
}

function buildCountryLookup(rankings: RankingsSnapshot) {
	const lookup: Rankings["countryIDToIndex"] = {};

	for (const [index, country] of rankings.countries.entries()) {
		lookup[country.id] = index;
	}

	return lookup;
}


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
			const competitionIDToIndex = buildCompetitionLookup(payload);
			const personIDToIndex = buildPersonLookup(payload);
			const continentIDToIndex = buildContinentLookup(payload);
			const countryIDToIndex = buildCountryLookup(payload);
			const activeRegions = buildActiveRegions(
				payload,
				personIDToIndex,
				continentIDToIndex,
				countryIDToIndex
			);

			return {
				lastUpdated: payload.refreshed,
				data: payload,
				competitionIDToIndex,
				personIDToIndex,
				continentIDToIndex,
				countryIDToIndex,
				activeRegions,
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

function buildActiveRegions(
	rankingsData: RankingsSnapshot,
	personIDToIndex: {[key: string]: number},
	continentIDToIndex: {[key: string]: number},
	countryIDToIndex: {[key: string]: number}
): Rankings["activeRegions"] {

	const activeRegions: Rankings["activeRegions"] = {
		continents: new Set(),
		countries: new Set()
	};

	for (const event of rankingsData.events) {
		for (const eventRanking of event.rankings) {
			for (const rank of eventRanking.ranks) {
				const person = rankingsData.persons[personIDToIndex[rank.id]];
				if (!person) {
					throw new Error(`Missing competitor ID ${rank.id}`);
				}
				const country = rankingsData.countries[countryIDToIndex[person.country]];
				if (!country) {
					throw new Error(`Missing country ID ${person.country}`);
				}
				const continent = rankingsData.continents[continentIDToIndex[country.continent]];
				if (!continent) {
					throw new Error(`Missing continent ID ${country.continent}`);
				}

				activeRegions.continents.add(continent.id);
				activeRegions.countries.add(country.id);
			}
		}
	}

	return activeRegions;
}
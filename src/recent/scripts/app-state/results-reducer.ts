import {ExtendedRankingsData, Continent, Country} from "../../../common/scripts/rankings-snapshot";
import {parseMultiResult, timeResultToSeconds} from "../../../common/scripts/util/parse";
import {ResultRow, Filters, SortColumn} from "./app-state";

import {
	type AppAction,
	type RankingsFilteredAction,
	type ResultsSortedAction,
	AppActionTypes
} from "./app-actions";

export interface ContinentCounts {
	[key: Continent["id"]]: number
}

export interface CountryCounts {
	[key: Country["id"]]: number
}

export interface RegionCounts {
	world: number
	continents: ContinentCounts
	countries: CountryCounts
};

export function filterRankingsAction(rankings: ExtendedRankingsData, filters: Filters): RankingsFilteredAction {
	return {
		type: AppActionTypes.rankingsFiltered,
		payload: {rankings: rankings, filters}
	};
};

export function sortResultsAction(sortColumns: SortColumn[], rankingType: Filters["rankingType"]): ResultsSortedAction {
	return {
		type: AppActionTypes.resultsSorted,
		payload: {
			sortColumns,
			rankingType: rankingType,
		}
	};
};

export function resultsReducer(results: ResultRow[] = [], action: AppAction): ResultRow[] {
	const {type, payload} = action;

	switch (type) {
		case AppActionTypes.rankingsFiltered: {
			return filterRankings(payload.rankings, payload.filters);
		}

		case AppActionTypes.resultsSorted: {
			return sortResults(results, payload.sortColumns, payload.rankingType);
		}
	}

	return results;
};

function filterRankings(rankings: ExtendedRankingsData, filters: Filters): ResultRow[] {
	const rankingsData = rankings.data;
	const {competitionIDToIndex, personIDToIndex, continentIDToIndex, countryIDToIndex} = rankings;
	const {topN, timeFrame} = filters;
	const MS_PER_DAY = 24 * 60 * 60 * 1000;
	const results: ResultRow[] = [];

	// event: id, name, format (time, number, multi), rankings[]
	for (const event of rankingsData.events) {

		// eventRanking: type (single, average, ...), age, ranks[]
		for (const eventRanking of event.rankings) {
			const regionCounts = {world: 0, continents: {}, countries: {}} as RegionCounts;

			// rank: rank, id, best, competition
			for (const [rankIdx, rank] of eventRanking.ranks.entries()) {
				const comp = rankingsData.competitions[competitionIDToIndex[rank.competition]];
				if (!comp) {
					throw new Error(`Missing competition ID ${rank.competition}`);
				}
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
				const daysAgo = Math.floor(
					(new Date().getTime() - new Date(comp.startDate).getTime()) / MS_PER_DAY
				);

				regionCounts.world++;
				regionCounts.continents[continent.id] ??= 0;
				regionCounts.continents[continent.id]++;
				regionCounts.countries[country.id] ??= 0;
				regionCounts.countries[country.id]++;

				const missingWorld = eventRanking.missing?.world ?? 0;
				let missing: number;
				let fakeRatio = 1;
				let thisRank: number;

				if (filters.rankingType === "cr") {
					if (eventRanking.missing.continents?.[continent.id]) {
						missing = eventRanking.missing.continents[continent.id];

						if (missingWorld > 0) {
							fakeRatio = missing / missingWorld;
						}
					} else if (missingWorld > 0) {
						fakeRatio = 0;
					}

					thisRank = regionCounts.continents[continent.id] + fakeRatio * (rank.rank - rankIdx - 1);

				} else if (filters.rankingType === "nr") {
					if (eventRanking.missing.countries?.[country.id]) {
						missing = eventRanking.missing.countries[country.id];

						if (missingWorld > 0) {
							fakeRatio = missing / missingWorld;
						}
					} else if (missingWorld > 0) {
						fakeRatio = 0;
					}

					thisRank = regionCounts.countries[country.id] + fakeRatio * (rank.rank - rankIdx - 1);

				} else {
					missing = missingWorld;
					thisRank = regionCounts.world + fakeRatio * (rank.rank - rankIdx - 1);
				}
				thisRank = Number(thisRank.toFixed(0));

				const rowData: ResultRow = {
					event: event,
					eventType: eventRanking.type,
					age: eventRanking.age,
					date: comp.startDate,
					rank: thisRank,
					name: person.name,
					wcaID: person.id,
					continent: continent,
					country: country,
					result: rank.best,
					compName: comp.name,
					compWebID: comp.webId,
					compCountry: comp.country,
				};

				// Stash any that meet the criteria
				if (daysAgo <= timeFrame && thisRank <= topN && checkFilters(rowData, filters)) {
					results.push(rowData);
				}
			}
		}
	}

	return results;
}

function checkFilters(rowData: ResultRow, filters: Filters): boolean {
	return (
		checkSearchFilter(rowData, filters.search)
		&& checkEventFilter(rowData, filters.event)
		&& checkEventTypeFilter(rowData, filters.eventType)
		&& checkAgeFilter(rowData, filters.age)
		&& checkContinentFilter(rowData, filters.continent)
		&& checkCountryFilter(rowData, filters.country)
	);
}

function checkEventFilter(rowData: ResultRow, eventID: Filters["event"]) {
	if (!eventID) {
		return true;
	}

	return rowData.event.id === eventID;
}

function checkEventTypeFilter(rowData: ResultRow, eventType: Filters["eventType"]) {
	if (!eventType) {
		return true;
	}

	return rowData.eventType === eventType;
}

function checkAgeFilter(rowData: ResultRow, age: Filters["age"]) {
	if (!age) {
		return true;
	}

	return rowData.age >= age;
}

function checkContinentFilter(rowData: ResultRow, continent: Filters["continent"]): boolean {
	if (!continent) {
		return true;
	}

	return rowData.continent.id === continent;
}

function checkCountryFilter(rowData: ResultRow, country: Filters["country"]): boolean {
	if (!country) {
		return true;
	}

	return rowData.country.id === country;
}

function checkSearchFilter(rowData: ResultRow, search: Filters["search"]): boolean {
	if (!search) {
		return true;
	}

	// Concatenate the values we want to search in a space separated string
	const searchFields = [
		rowData.date,
		rowData.event.id, rowData.continent.id, rowData.age,
		rowData.event.id, rowData.country.id, rowData.age,
		rowData.event.id, rowData.age,
		rowData.event.id, rowData.eventType, rowData.continent.id, rowData.age,
		rowData.event.id, rowData.eventType, rowData.country.id, rowData.age,
		rowData.event.id, rowData.eventType, rowData.age,
		rowData.name,
		rowData.compName,
	];
	const rowString = searchFields.map(value => String(value)).join(" ");

	return (rowString.toLowerCase().includes(search.toLowerCase()));
}

/**
 *
 * @param results
 * @param sortColumns
 * @param rankingType
 * @returns
 */
function sortResults(
	results: ResultRow[],
	sortColumns: SortColumn[],
	rankingType: Filters["rankingType"]
): ResultRow[] {
	const resultsCopy = [...results];
	const sortColumnsCopy = [...sortColumns];

	sortColumnsCopy.reverse().map(sort);
	return resultsCopy;

	/**
	 *
	 * @param sortColumn
	 * @returns
	 */
	function sort(sortColumn: SortColumn): ResultRow[] {
		const {name, direction} = sortColumn;

		//---------------------------------------------------------------
		//
		function customGroupSort(a: ResultRow, b: ResultRow): number {
			switch (rankingType) {
				case "wr": {
					return direction * (a.age - b.age);
				}

				case "cr": {
					const aValue = `${a.continent.id} ${a.age}`;
					const bValue = `${b.continent.id} ${b.age}`;
					return direction * aValue.localeCompare(bValue);
				}

				case "nr": {
					const aValue = `${a.country.id} ${a.age}`;
					const bValue = `${b.country.id} ${b.age}`;
					return direction * aValue.localeCompare(bValue);
				}
			}
		}

		//---------------------------------------------------------------
		//
		function customEventSort(a: ResultRow, b: ResultRow): number {
			const eventOrder = [
				"333", "222", "444", "555", "666", "777",
				"333bf", "333fm", "333oh",
				"clock", "minx", "pyram", "skewb", "sq1",
				"444bf", "555bf", "333mbf",
			];
			const aOrder = eventOrder.indexOf(a.event.id);
			const bOrder = eventOrder.indexOf(b.event.id);

			// Sort single before average
			if (aOrder === bOrder && a.eventType !== b.eventType) {
				return direction * ((a.eventType === "single") ? -1 : 1);
			}
			return direction * (aOrder - bOrder);
		}

		//---------------------------------------------------------------
		//
		function customResultSort(a: ResultRow, b: ResultRow): number {
			if (a.event.format !== b.event.format) {
				// Comparing different formats, arbitrarily
				// sort in order: time, number, multi
				if (a.event.format === "time" || b.event.format === "time") {
					return direction * (a.event.format === "time" ? -1 : 1);
				}

				// Different formats and neither is time, so one must be number
				return direction * (a.event.format === "number" ? -1 : 1);
			} else {
				// They're both the same format, what are we comparing?
				switch (a.event.format) {
					case "time": {
						const [aSeconds, bSeconds] = [a.result, b.result].map(timeResultToSeconds);
						return direction * (aSeconds - bSeconds);
					}

					case "number": {
						return direction * (Number(a.result) - Number(b.result));
					}

					/**
					 * Multi-Blind rankings are assessed based on the number of puzzles solved minus
					 * the number of puzzles not solved, where a greater difference is better.
					 *
					 * If competitors achieve the same result, rankings are assessed based on total
					 * time, where the shorter recorded time is better.
					 *
					 * If competitors achieve the same result and the same time, rankings are
					 * assessed based on the number of puzzles the competitors failed to solve,
					 * where fewer unsolved puzzles are better.
					 */
					case "multi": {
						const [aMulti, bMulti] = [a.result, b.result].map(parseMultiResult);

						if (aMulti.score !== bMulti.score) {
							// Sort is negated because bigger is better
							return -direction * (aMulti.score - bMulti.score);
						}
						if (aMulti.seconds !== bMulti.seconds) {
							return direction * (aMulti.seconds - bMulti.seconds);
						}
						return direction * (aMulti.unsolved - bMulti.unsolved);
					}
				}
			}
		}

		switch (name) {
			// String sort
			case "date":
			case "name":
				resultsCopy.sort((a, b) =>
					direction * a[name].localeCompare(b[name])
				);
				break;

			// Numeric sort
			case "rank":
				resultsCopy.sort((a, b) => direction * (a[name] - b[name]));
				break;

			// Custom
			case "event":
				resultsCopy.sort(customEventSort);
				break;

			// Custom
			case "group":
				resultsCopy.sort(customGroupSort);
				break;

			// Multiple formats to deal with: time, number, and multi
			case "result":
				resultsCopy.sort(customResultSort);
				break;
		}

		return resultsCopy;
	}
}

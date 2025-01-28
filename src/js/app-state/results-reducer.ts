import type {Continent, Country} from "../rankings-snapshot";
import type {ResultRow, Rankings, Filters, SortColumn} from "./app-state";
import {
	type AppAction,
	type RankingsFilteredAction,
	type ResultsSortedAction,
	AppActionTypes
} from "./app-actions";

interface ContinentAccumulator {
	[key: Continent["id"]]: number
}
interface CountryAccumulator {
	[key: Country["id"]]: number
}
interface Accumulators {
	world: number
	continents: ContinentAccumulator
	countries: CountryAccumulator
};
interface MultiResult {
	/* solved minus unsolved */
	score: number,
	seconds: number,
	unsolved: number
}

export function filterRankingsAction(rankings: Rankings, filters: Filters): RankingsFilteredAction {
	return {
		type: AppActionTypes.rankingsFiltered,
		payload: {rankings: rankings, filters}
	};
};

export function sortResultsAction(sortColumns: SortColumn[], region: Filters["region"]): ResultsSortedAction {
	return {
		type: AppActionTypes.resultsSorted,
		payload: {
			sortColumns,
			region,
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
			return sortResults(results, payload.sortColumns, payload.region);
		}
	}

	return results;
};

function filterRankings(rankings: Rankings, filters: Filters): ResultRow[] {
	const rankingsData = rankings.data;
	const {competitionIDToIndex, personIDToIndex, continentIDToIndex, countryIDToIndex} = rankings;
	const {topN, timeFrame} = filters;
	const MS_PER_DAY = 24 * 60 * 60 * 1000;
	const results: ResultRow[] = [];

	// event: id, name, format (time, number, multi), rankings[]
	for (const event of rankingsData.events) {

		// eventRanking: type (single, average, ...), age, ranks[]
		for (const eventRanking of event.rankings) {
			const acc = {world: 0, continents: {}, countries: {}} as Accumulators;

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

				acc.world++;
				acc.continents[continent.id] ??= 0;
				acc.continents[continent.id]++;
				acc.countries[country.id] ??= 0;
				acc.countries[country.id]++;

				const missingWorld = eventRanking.missing?.world ?? 0;
				let missing: number;
				let fakeRatio = 1;
				let thisRank: number;

				if (filters.region === "continent") {
					if (eventRanking.missing.continents?.[continent.id]) {
						missing = eventRanking.missing.continents[continent.id];

						if (missingWorld > 0) {
							fakeRatio = missing / missingWorld;
						}
					} else if (missingWorld > 0) {
						fakeRatio = 0;
					}

					thisRank = acc.continents[continent.id] + fakeRatio * (rank.rank - rankIdx - 1);

				} else if (filters.region === "country") {
					if (eventRanking.missing.countries?.[country.id]) {
						missing = eventRanking.missing.countries[country.id];

						if (missingWorld > 0) {
							fakeRatio = missing / missingWorld;
						}
					} else if (missingWorld > 0) {
						fakeRatio = 0;
					}

					thisRank = acc.countries[country.id] + fakeRatio * (rank.rank - rankIdx - 1);

				} else {
					missing = missingWorld;
					thisRank = acc.world + fakeRatio * (rank.rank - rankIdx - 1);
				}
				thisRank = Number(thisRank.toFixed(0));

				const rowData: ResultRow = {
					eventID: event.id,
					eventName: event.name,
					eventType: eventRanking.type,
					eventFormat: event.format,
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

/**
 *
 * @param rowData
 * @param filters
 * @returns
 */
function checkFilters(rowData: ResultRow, filters: Filters): boolean {
	const {search} = filters;

	if (!search) {
		return true;
	}

	// Concatenate the values we want to search in a space separated string
	const searchFields = [
		rowData.date,
		rowData.eventID, rowData.continent.id, rowData.age,
		rowData.eventID, rowData.country.id, rowData.age,
		rowData.eventID, rowData.age,
		rowData.eventID, rowData.eventType, rowData.continent.id, rowData.age,
		rowData.eventID, rowData.eventType, rowData.country.id, rowData.age,
		rowData.eventID, rowData.eventType, rowData.age,
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
 * @param region
 * @returns
 */
function sortResults(
	results: ResultRow[],
	sortColumns: SortColumn[],
	region: Filters["region"]
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
			switch (region) {
				case "world": {
					return direction * (a.age - b.age);
				}

				case "continent": {
					const aValue = `${a.continent.id} ${a.age}`;
					const bValue = `${b.continent.id} ${b.age}`;
					return direction * aValue.localeCompare(bValue);
				}

				case "country": {
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
			const aOrder = eventOrder.indexOf(a.eventID);
			const bOrder = eventOrder.indexOf(b.eventID);

			// Sort single before average
			if (aOrder === bOrder && a.eventType !== b.eventType) {
				return direction * ((a.eventType === "single") ? -1 : 1);
			}
			return direction * (aOrder - bOrder);
		}

		//---------------------------------------------------------------
		//
		function customResultSort(a: ResultRow, b: ResultRow): number {
			if (a.eventFormat !== b.eventFormat) {
				// Comparing different formats, arbitrarily
				// sort in order: time, number, multi
				if (a.eventFormat === "time" || b.eventFormat === "time") {
					return direction * (a.eventFormat === "time" ? -1 : 1);
				}

				// Different formats and neither is time, so one must be number
				return direction * (a.eventFormat === "number" ? -1 : 1);
			} else {
				// They're both the same format, what are we comparing?
				switch (a.eventFormat) {
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

/**
 *
 * @param result - Format: Solved/Attempted in MM:SS - Example: 3/4 in 38:05
 * @returns
 */
function parseMultiResult(result: string): MultiResult {
	const [solvedAndAttempted, time] = result.split(" in ");
	const [solved, attempted] = solvedAndAttempted.split("/").map(Number);
	const unsolved = attempted - solved;
	const score = solved - unsolved;
	const seconds = timeResultToSeconds(time);

	return {score, seconds, unsolved};
}

/**
 *
 * @param result - Minutes and hours are not padded if zero: 23.27, 1:40.83, 1:00:02
 * @returns      The duration in seconds
 */
function timeResultToSeconds(result: string): number {
	const parts = result.split(":").reverse();
	let seconds = 0;
	let multiplier = 1;

	for (const part of parts) {
		seconds += Number(part) * multiplier;
		multiplier *= 60;
	}

	return seconds;
}

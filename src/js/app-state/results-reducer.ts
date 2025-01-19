import type {RankingsSnapshot} from "../rankings-snapshot";
import type {ResultRow, Filters, SortColumn} from "./app-state";
import {
	type AppAction,
	type RankingsFilteredAction,
	type ResultsSortedAction,
	AppActionTypes
} from "./app-actions";

export function filterRankingsAction(rankingsData: RankingsSnapshot, filters: Filters): RankingsFilteredAction {
	return {
		type: AppActionTypes.rankingsFiltered,
		payload: {rankingsData, filters}
	};
};

export function sortResultsAction(sortColumns: SortColumn[]): ResultsSortedAction {
	return {
		type: AppActionTypes.resultsSorted,
		payload: sortColumns
	};
};

export function resultsReducer(results: ResultRow[] = [], action: AppAction): ResultRow[] {
	const {type, payload} = action;

	switch (type) {
		case AppActionTypes.rankingsFiltered: {
			return filterRankings(payload.rankingsData, payload.filters);
		}
		case AppActionTypes.resultsSorted: {
			return sortResults(results, payload);
		}
	}

	return results;
};

/**
 *
 * @param rankingsData
 * @param filters
 * @returns
 * @throws
 */
function filterRankings(rankingsData: RankingsSnapshot, filters: Filters): ResultRow[] {
	const {topN, timeFrame} = filters;
	const MS_PER_DAY = 24 * 60 * 60 * 1000;
	const results: ResultRow[] = [];

	// event: id, name, format (time, number, multi), rankings[]
	for (const event of rankingsData.events) {

		// eventRanking: type (single, average, ...), age, ranks[]
		for (const eventRanking of event.rankings) {

			// rank: rank, id, best, competition
			for (const rank of eventRanking.ranks) {
				const comp = rankingsData.competitions.find(c => c.id === rank.competition);
				if (!comp) {
					throw `Missing competition ID ${rank.competition}`;
				}
				const person = rankingsData.persons.find(p => p.id === rank.id);
				if (!person) {
					throw `Missing competitor ID ${rank.id}`;
				}
				const daysAgo = Math.floor(
					(new Date().getTime() - new Date(comp.startDate).getTime()) / MS_PER_DAY
				);

				const rowData: ResultRow = {
					eventID: event.id,
					eventName: event.name,
					eventType: eventRanking.type,
					eventFormat: event.format,
					age: eventRanking.age,
					date: comp.startDate,
					rank: rank.rank,
					name: person.name,
					wcaID: person.id,
					result: rank.best,
					compName: comp.name,
					compWebID: comp.webId,
					compCountry: comp.country,
				};

				// Stash this one if it qualifies as "recent" and passes filter checks
				if (daysAgo <= timeFrame && checkFilters(rowData, filters)) {
					results.push(rowData);
				}

				// Only consider the top N
				if (rank.rank > Math.min(eventRanking.ranks.length, topN) - 1) {
					break;
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
	const searchFields = ["date", "eventID", "eventType", "name", "compName"];
	const rowString = searchFields.map(prop => rowData[prop as keyof ResultRow]).join(" ");

	return (rowString.toLowerCase().includes(search.toLowerCase()));
}

/**
 *
 * @param results
 * @param sortColumns
 * @returns
 */
function sortResults(results: ResultRow[], sortColumns: SortColumn[]): ResultRow[] {
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

		switch (name) {
			// String sort
			case "date":
			case "name":
				resultsCopy.sort((a, b) =>
					direction * a[name].localeCompare(b[name])
				);
				break;

			// Numeric sort
			case "age":
			case "rank":
				resultsCopy.sort((a, b) => direction * (a[name] - b[name]));
				break;

			// Custom
			case "event":
				resultsCopy.sort(customEventSort);
				break;

			// Multiple formats to deal with: time, number, and multi
			case "result":
				resultsCopy.sort(customResultSort);
				break;
		}

		return resultsCopy;

		/**
		 *
		 * @param a
		 * @param b
		 * @returns
		 */
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

		/**
		 *
		 * @param a
		 * @param b
		 * @returns
		 */
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
	}
}

interface MultiResult {
	/* solved minus unsolved */
	score: number,
	seconds: number,
	unsolved: number
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
		seconds += +part * multiplier;
		multiplier *= 60;
	}

	return seconds;
}

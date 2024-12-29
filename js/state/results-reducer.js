const ACTION_TYPES = {
	rankingsFiltered: "rankingsFiltered",
	resultsSorted: "resultsSorted",
};

/**
 * @param {RankingsSnapshot} rankingsData
 * @param {Filters}          filters
 *
 * @returns {Action}
 */
export const filterRankingsAction = (rankingsData, filters) => {
	return {
		type: ACTION_TYPES.rankingsFiltered,
		payload: {rankingsData, filters}
	};
};

/**
 * @param {SortColumn[]} sortColumns
 *
 * @returns {Action}
 */
export const sortResultsAction = (sortColumns) => {
	return {
		type: ACTION_TYPES.resultsSorted,
		payload: sortColumns
	};
};

/**
 *
 * @param {ResultRowData[]} results
 * @param {Action}          action
 *
 * @returns {ResultRowData[]}
 */
export const resultsReducer = (results = [], action) => {
	const {type, payload} = action;

	switch (type) {
		case ACTION_TYPES.rankingsFiltered: {
			const {rankingsData, filters} = payload;
			return filterResults(rankingsData, filters);
		}

		case ACTION_TYPES.resultsSorted: {
			return sortResults(results, payload);
		}
	}

	return results;
};

/**
 * @param {RankingsSnapshot} rankingsData
 * @param {Filters} filters
 *
 * @returns {ResultRowData[]}  Array of resulting rows
 */
function filterResults(rankingsData, filters) {
	const {topN, recentInDays} = filters;
	const MS_PER_DAY = 24 * 60 * 60 * 1000;
	const results = [];

	// event: id, name, format (time, number, multi), rankings[]
	for (const event of rankingsData.events) {

		// eventRanking: type (single, average, ...), age, ranks[]
		for (const eventRanking of event.rankings) {

			// rank: rank, id, best, competition
			for (const rank of eventRanking.ranks) {
				const comp = rankingsData.competitions.find(c => c.id === rank.competition);
				const person = rankingsData.persons.find(p => p.id === rank.id);
				const daysAgo = Math.floor((new Date() - new Date(comp.startDate)) / MS_PER_DAY);

				const rowData = {
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
				if (daysAgo <= recentInDays && checkFilters(rowData, filters)) {
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
 * @param {ResultRowData} rowData
 * @param {Filters}       filters
 *
 * @returns {Boolean}
 */
function checkFilters(rowData, filters) {
	const {search} = filters;

	if (!search) {
		return true;
	}

	const searchFields = ["date", "eventID", "eventType", "name", "compName"];
	const rowString = searchFields.reduce((str, key) => str + " " + rowData[key], "");

	return (rowString.toLowerCase().includes(search.toLowerCase()));
}

/**
 *
 * @param {ResultRowData[]} results
 * @param {SortColumn[]}    sortColumns
 *
 * @returns {ResultRowData[]}
 */
function sortResults(results, sortColumns) {
	const resultsCopy = [...results];
	const sortColumnsCopy = [...sortColumns];

	sortColumnsCopy.reverse().map(sort);
	return resultsCopy;

	/**
	 * @param {SortColumn} sortColumn
	 * @returns
	 */
	function sort(sortColumn) {
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
		 * @param {ResultRowData} a
		 * @param {ResultRowData} b
		 *
		 * @returns {number}
		 */
		function customEventSort(a, b) {
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
		 * @param {ResultRowData} a
		 * @param {ResultRowData} b
		 *
		 * @returns {number}
		 */
		function customResultSort(a, b) {
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
						return direction * (a.result - b.result);
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

/**
 * @param {string} result
 *     Format: Solved/Attempted in MM:SS - Example: 3/4 in 38:05
 *
 * @returns {MultiResult}
 *
 * @typedef {Object} MultiResult
 * @property {number} score    solved - unsolved
 * @property {number} seconds
 * @property {number} unsolved
 */
function parseMultiResult(result) {
	const [solvedAndAttempted, time] = result.split(" in ");
	const [solved, attempted] = solvedAndAttempted.split("/");
	const unsolved = attempted - solved;
	const score = solved - unsolved;
	const seconds = timeResultToSeconds(time);

	return {score, seconds, unsolved};
}

/**
 * @param {string} result
 *     Minutes and hours are not padded if zero:
 *     23.27, 1:40.83, 1:00:02
 *
 * @returns {number} The duration in seconds
 */
function timeResultToSeconds(result) {
	const parts = result.split(":").reverse();
	let seconds = 0;
	let multiplier = 1;

	for (const part of parts) {
		seconds += +part * multiplier;
		multiplier *= 60;
	}

	return seconds;
}

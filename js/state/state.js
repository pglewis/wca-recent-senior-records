/**
 * Minimal store implementation
 *
 * @param {AppState}  initialState
 * @param {ReducerCB} reducer
 *
 * @returns {DataStore}
 */
export const createStore = (initialState, reducer) => {
	let state = initialState;

	/** @type {GetStateCB} */
	function getState() {
		return state;
	}

	/** @type {DispatchCB} */
	function dispatch(action) {
		const prevState = getState();
		state = reducer(prevState, action);
	}

	return {
		getState,
		dispatch,
	};
};

const ACTION_TYPES = {
	resultsCleared: "resultsCleared",
	rankingsSearched: "rankingsSearched",
	resultsSorted: "resultsSorted",
	topNChanged: "topNChanged",
	recentInDaysChanged: "recentInDaysChanged",
	sortFieldsChanged: "sortFieldsChanged",
};

/**
 *
 * @param {SortChange} value
 *
 * @returns {Action}
 */
export const updateSortFieldsAction = value => {
	return {
		type: ACTION_TYPES.sortFieldsChanged,
		payload: value
	};
};

/**
 * @returns {Action}
 */
export const clearResultsAction = () => {
	return {type: ACTION_TYPES.resultsCleared};
};

/**
 * @param {ResultRowData[]|null} value  The full rankings snapshot
 *
 * @returns {Action}
 */
export const searchRankingsAction = value => {
	return {
		type: ACTION_TYPES.rankingsSearched,
		payload: value
	};
};

/**
 * @returns {Action}
 */
export const sortResultsAction = () => {
	return {
		type: ACTION_TYPES.resultsSorted
	};
};

/**
 *
 * @param {number} value
 *
 * @returns {Action}
 */
export const setTopNAction = value => {
	return {
		type: ACTION_TYPES.topNChanged,
		payload: value
	};
};

/**
 *
 * @param {number} value
 *
 * @returns {Action}
 */
export const setRecentInDaysAction = value => {
	return {
		type: ACTION_TYPES.recentInDaysChanged,
		payload: value
	};
};

/**
 * Returns the new state resulting from performing an action on a state
 *
 * @type {ReducerCB}
 */
export const reducer = (state, action) => {
	const {type, payload} = action;

	switch (type) {
		case ACTION_TYPES.resultsCleared:
			return {...state, results: null};

		case ACTION_TYPES.rankingsSearched:
			/** payload is the rankings data snapshot */
			return {...state, results: searchRankings(payload, state)};

		case ACTION_TYPES.resultsSorted:
			return {...state, results: sortResults(state)};

		case ACTION_TYPES.topNChanged:
			return {...state, topN: payload};

		case ACTION_TYPES.recentInDaysChanged:
			return {...state, recentInDays: payload};

		case ACTION_TYPES.sortFieldsChanged:
			return {...state, sortColumns: sortFieldsChanged(payload, state)};
	}

	return state;
};

/**
 * @param {GlobalRankingsSnapshot} rankingData
 * @param {AppState} state
 *
 * @returns {ResultRowData[]}  Array of resulting rows
 */
function searchRankings(rankingData, state) {
	const {topN, recentInDays} = state;
	const MS_PER_DAY = 24 * 60 * 60 * 1000;
	const results = [];

	// event: id, name, format (time, number, multi), rankings[]
	for (const event of rankingData.events) {

		// eventRanking: type (single, average, ...), age, ranks[]
		for (const eventRanking of event.rankings) {
			const maxRank = Math.min(eventRanking.ranks.length, topN);

			// rank: rank, id, best, competition
			for (const [index, rank] of eventRanking.ranks.entries()) {
				const comp = rankingData.competitions.find(c => c.id === rank.competition);
				const daysAgo = Math.floor((new Date() - new Date(comp.startDate)) / MS_PER_DAY);

				// Does this qualify as "recent"?
				if (daysAgo <= recentInDays) {
					const person = rankingData.persons.find(p => p.id === rank.id);

					results.push({
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
					});
				}

				// Only consider the top N (index is 0 based)
				if (index >= maxRank - 1) {
					break;
				}
			}
		}
	}
	return results;
}

/**
 * --!! TODO: Stop mutating the state in place
 *
 * @param {AppState} state
 */
function sortResults(state) {
	const {results, sortColumns} = state;

	sortColumns.reverse();
	sortColumns.map(sort);
	sortColumns.reverse();
	return results;

	/**
	 * @param {SortColumn} sortField
	 * @returns
	 */
	function sort(sortField) {
		const {name, direction} = sortField;

		switch (name) {
			// String sort
			case "date":
			case "name":
				results.sort((a, b) =>
					direction * a[name].localeCompare(b[name])
				);
				break;

			// Numeric sort
			case "age":
			case "rank":
				results.sort((a, b) =>
					direction * (a[name] - b[name])
				);
				break;

			// Custom
			case "event":
				results.sort(customEventSort);
				break;

			// Multiple formats to deal with: time, number, and multi
			case "result":
				results.sort(customResultSort);
				break;
		}

		return results;

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
				return (a.eventType === "single") ? -1 : 1;
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

					case "multi": {
						/**
						 * Multi-Blind rankings are assessed based on the number of
						 * puzzles solved minus the number of puzzles not solved, where
						 * a greater difference is better.
						 *
						 * If competitors achieve the same result, rankings are assessed
						 * based on total time, where the shorter recorded time is better.
						 *
						 * If competitors achieve the same result and the same time,
						 * rankings are assessed based on the number of puzzles the
						 * competitors failed to solve, where fewer unsolved puzzles are
						 * better.
						 */
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
	}
}

/**
 *
 * @param {SortChange} newSort
 * @param {AppState} state
 * @returns
 */
function sortFieldsChanged(newSort, state) {
	const {sortColumns} = state;
	const sortColumnsCopy = [...sortColumns];
	const oldPosition = sortColumns.findIndex(f => f.name === newSort.name);

	// Completely new sort column?  Drop it in the new position
	if (oldPosition < 0) {
		sortColumnsCopy[newSort.position] = {
			name: newSort.name,
			label: newSort.label,
			direction: newSort.defaultDirection || 1
		};
		return sortColumnsCopy;
	}

	// Existing column, same position? (Unary plus to cast to number)
	if (+oldPosition === +newSort.position) {
		sortColumnsCopy[newSort.position].direction *= -1;
		return sortColumnsCopy;
	}

	// All that's left is an existing column being repositioned
	sortColumnsCopy.splice(oldPosition, 1);
	sortColumnsCopy.splice(newSort.position, 0, sortColumns[oldPosition]);
	return sortColumnsCopy;
}

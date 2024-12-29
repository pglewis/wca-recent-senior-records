const ACTION_TYPES = {
	rankingsDataSet: "rankingsDataSet",
};

/**
 *
 * @param {RankingsSnapshot} rankingsSnapshot
 *
 * @returns {Action}
 */
export const setRankingsDataAction = rankingsSnapshot => {
	return {
		type: ACTION_TYPES.rankingsDataSet,
		payload: rankingsSnapshot
	};
};

/**
 * @type {ReducerCB}
 *
 * @param {Rankings}  rankings
 * @param {Action}    action
 *
 * @returns {Rankings}
 */
export const rankingsReducer = (rankings = {}, action) => {
	const {type, payload} = action;

	switch (type) {
		case ACTION_TYPES.rankingsDataSet: {
			return {lastUpdated: payload.refreshed, data: payload};
		}
	}

	return rankings;
};

const ACTION_TYPES = {
	rankingsDataSet: "rankingsDataSet",
};

/** @type {import("./rankings-reducer").setRankingsDataAction} setRankingsDataAction */
export const setRankingsDataAction = rankingsSnapshot => {
	return {
		type: ACTION_TYPES.rankingsDataSet,
		payload: rankingsSnapshot
	};
};

/** @type {import("./rankings-reducer").rankingsReducer} rankingsReducer */
export const rankingsReducer = (rankings = {}, action) => {
	const {type, payload} = action;

	switch (type) {
		case ACTION_TYPES.rankingsDataSet: {
			return {lastUpdated: payload.refreshed, data: payload};
		}
	}

	return rankings;
};

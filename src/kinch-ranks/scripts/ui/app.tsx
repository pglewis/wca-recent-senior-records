// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {PersonRanks} from "./person-ranks";
import {Leaderboard} from "./leaderboard";
import {Parameters} from "./parameters";
import {LastRefreshed} from "./last-refreshed";

export function App(props: AppProps) {
	const store = props.store;
	const state = store.getState();
	const {wcaid} = state.filters;

	if (wcaid) {
		return personRanks(props);
	} else {
		return leaderboard(props);
	}
}

function personRanks(props: AppProps) {
	const lastRefreshed = props.store.getState().rankings.lastUpdated;

	return (
		<div class="app-container personal-ranks">
			<Parameters {...props} />
			<PersonRanks {...props} />
			<LastRefreshed lastRefreshed={lastRefreshed} />
		</div>
	);
}

function leaderboard(props: AppProps) {
	const lastRefreshed = props.store.getState().rankings.lastUpdated;

	return (
		<div class="app-container leaderboard">
			<Parameters {...props} />
			<Leaderboard {...props} />
			<LastRefreshed lastRefreshed={lastRefreshed} />
		</div>
	);
}

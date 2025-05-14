// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {KinchRank} from "../types";
import {AppProps} from "../app-state/app-state";
import {setWCAIDFilterAction} from "../app-state/filters-reducer";
import {getURLState, updateURLState} from "../url-state";

export function Leaderboard(props: AppProps) {
	const store = props.store;
	const state = store.getState();
	const kinchRanks = state.data.kinchRanks;
	const {page, rowsPerPage} = state.filters;

	// Calculate start and end indices for current page
	const startIdx = (page - 1) * rowsPerPage;
	const endIdx = startIdx + rowsPerPage;

	// Slice the data for current page
	const paginatedRanks = kinchRanks.slice(startIdx, endIdx);

	return (
		<table id="leaderboard">
			<tbody>
				<tr>
					<th class="rank">#</th>
					<th class="name">Name</th>
					<th class="score">Score</th>
				</tr>
				{paginatedRanks.map((kinchRank, index) => RankingRow(props, kinchRank, startIdx + index + 1))}
			</tbody>
		</table>
	);
}

function RankingRow(appProps: AppProps, kinchRank: KinchRank, ranking: number) {
	const {store, handleRender} = appProps;
	const {personID, personName, overall} = kinchRank;
	const url = new URL(window.location.href);

	url.searchParams.set("wcaid", personID);
	const link = `${url.pathname}${url.search}`;

	function handlePersonClick(e: Event, personID: string) {
		e.preventDefault();
		store.dispatch(setWCAIDFilterAction(personID));
		updateURLState({...getURLState(), ...{wcaid: personID}});
		handleRender();
	}

	return (
		<tr>
			<td class="rank">{ranking}</td>
			<td class="name">
				<a href={link} class="link" onClick={(e) => handlePersonClick(e, personID)}>{personName}</a>
			</td>
			<td class="score">{overall.toFixed(2)}</td>
		</tr>
	);
}

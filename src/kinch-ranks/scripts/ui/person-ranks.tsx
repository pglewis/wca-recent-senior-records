// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {KinchEvent, KinchRank} from "../types";
import {AppFilters, AppProps} from "../app-state/app-state";

export function PersonRanks(props: AppProps) {
	const {store} = props;
	const state = store.getState();
	const rankings = state.rankings;
	const {kinchRanks} = state.data;
	const {wcaid} = state.filters;
	const rankIndex = kinchRanks.findIndex(rank => rank.personId === wcaid);
	const competitorBaseURL = "https://www.worldcubeassociation.org/persons";
	const competitorURL = `${competitorBaseURL}/${wcaid}`;


	if (rankIndex < 0) {
		const person = rankings.data.persons[rankings.personIDToIndex[wcaid as string]];
		if (!person) {
			return (<div>WCA ID <b>{wcaid}</b> was not found.</div>);
		}
		return (<NoKinchData name={person.name} />);
	}

	const kinchRank = kinchRanks[rankIndex];
	const ranking = rankIndex + 1;
	return (
		<div>
			<p>
				<h3><a href={competitorURL} target="_blank">{kinchRank.personName}</a></h3>
				<div>Rank: {ranking}</div>
				<div>Overall score: {kinchRank.overall.toFixed(2)}</div>
				<div><a href=".">View the leaderboard</a></div>
			</p>
			<KinchEventTable kinchRank={kinchRank} filters={state.filters}/>
		</div>
	);
}

function KinchEventTable(props: {kinchRank: KinchRank, filters: AppFilters}) {
	const {kinchRank, filters} = props;

	return (
		<table id="person-ranks">
			<tbody>
				<tr>
					<th class="event">Event</th>
					<th class="score">Score</th>
					<th class="result">Result</th>
				</tr>
				{kinchRank.events.map(e => KinchEventRow({kinchEvent: e, filters: filters}))}
			</tbody>
		</table>
	);
}

function KinchEventRow(props: {kinchEvent: KinchEvent, filters: AppFilters}) {
	const {kinchEvent, filters} = props;
	const {eventName, score, result} = kinchEvent;

	let className = "";
	if (score >= 100) {
		className = "top-score";
	} else if (score >= 90) {
		className = "high-score";
	} else if (score >= 80) {
		className = "good-score";
	}

	let resultOut;
	if (result) {
		const rankingsBaseURL = "https://wca-seniors.org/Senior_Rankings.html";
		const rankingURL = `${rankingsBaseURL}#${kinchEvent.id}-${kinchEvent.type}-${filters.age}`;
		resultOut = (<a href={rankingURL} target="_blank">{result}</a>);
	} else {
		resultOut = "--";
	}

	return (
		<tr class={className}>
			<td class="event">{eventName}</td>
			<td class="score">{score.toFixed(2)}</td>
			<td class="result">{resultOut}</td>
		</tr>
	);
}

function NoKinchData(props: {name: string}) {
	return (
		<div>
			<h3>{props.name}</h3>
			<p>No Kinch ranks available for this age group.</p>
		</div>
	);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {KinchEvent, KinchRank} from "../types";
import {AppFilters, AppProps} from "../app-state/app-state";
import {setEventScoreSortAction} from "../app-state/ui-state-reducer";
import {scoreAverageOnly} from "../app-state/data-reducer";

export function PersonRanks(props: AppProps) {
	const {store} = props;
	const state = store.getState();
	const rankings = state.rankings;
	const {kinchRanks} = state.data;
	const {wcaid} = state.filters;
	const {eventScoreSort} = state.uiState.userInputState;
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

	function handleEventScoreSortChange(sort: "event" | "score") {
		store.dispatch(setEventScoreSortAction(sort));
		props.handleRender();
	};

	return (
		<div>
			<p>
				<h3><a href={competitorURL} target="_blank">{kinchRank.personName}</a></h3>
				<div>Rank: {ranking}</div>
				<div>Overall score: {kinchRank.overall.toFixed(2)}</div>
				<div><a href=".">View the leaderboard</a></div>
			</p>
			<KinchEventTable kinchRank={kinchRank} filters={state.filters} eventScoreSort={eventScoreSort} onEventScoreSortChange={handleEventScoreSortChange} />
		</div>
	);
}

interface KinchEventTableProps {
	kinchRank: KinchRank,
	filters: AppFilters,
	eventScoreSort: "event" | "score",
	onEventScoreSortChange: (sort: "event" | "score") => void,
};

function KinchEventTable(props: KinchEventTableProps) {
	const {
		kinchRank,
		filters,
		eventScoreSort,
		onEventScoreSortChange
	} = props;

	const kinchEvents = [...kinchRank.events];
	if (eventScoreSort === "score") {
		kinchEvents.sort((a, b) => b.score - a.score);
	}

	function getHeaderClass(column: "event" | "score"): string {
		return `${column}${eventScoreSort === column ? " sorted" : ""}`;
	}

	function handleEventColClick() {
		onEventScoreSortChange("event");
	}

	function handleScoreColClick() {
		onEventScoreSortChange("score");
	}

	return (
		<table id="person-ranks">
			<tbody>
				<tr>
					<th class={getHeaderClass("event")} onClick={handleEventColClick}>Event</th>
					<th class={getHeaderClass("score")} onClick={handleScoreColClick}>Score</th>
					<th class="result">Result</th>
				</tr>
				{kinchEvents.map(kinchEvent => KinchEventRow({
					kinchEvent: kinchEvent,
					filters: filters,
				}))}
			</tbody>
		</table>
	);
}

interface KinchEventRowProps {
	kinchEvent: KinchEvent,
	filters: AppFilters,
};

function KinchEventRow(props: KinchEventRowProps) {
	const {kinchEvent, filters} = props;
	const {eventName, score, result, type} = kinchEvent;


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
		const rankingURL = `${rankingsBaseURL}#${kinchEvent.id}-${type}-${filters.age}`;

		let resultType = "";
		if (kinchEvent.id !== "333mbf" && !scoreAverageOnly[kinchEvent.id]) {
			resultType = type === "single" ? " (sing)" : " (avg)";
		}
		resultOut = (
			<span>
				<a href={rankingURL} target="_blank" rel="noopener noreferrer">
					{result} {resultType}
				</a>
			</span>
		);
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
			<div><a href=".">View the leaderboard</a></div>
		</div>
	);
}

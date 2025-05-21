// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {Continent, Country} from "@repo/lib/types/rankings-snapshot";
import {AppFilters, AppProps} from "../app-state/app-state";
import {setEventScoreSortAction} from "../app-state/ui-state-reducer";
import {scoreAverageOnly} from "../app-state/data-reducer";
import {KinchEvent, KinchRank} from "../types";

export function PersonRanks(props: AppProps) {
	const {store} = props;
	const state = store.getState();
	const rankings = state.rankings;
	const {kinchRanks} = state.data;
	const {wcaid, age, region} = state.filters;
	const {eventScoreSort} = state.uiState.userInputState;
	const rankIndex = kinchRanks.findIndex(rank => rank.personID === wcaid);
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
				<div>Age Group: {age}</div>
				<div>Region: {region === "world" ? "World" : region}</div>
				<div>Rank: {ranking}</div>
				<div>Overall score: {kinchRank.overall.toFixed(2)}</div>
			</p>
			<KinchEventTable
				kinchRank={kinchRank}
				filters={state.filters}
				eventScoreSort={eventScoreSort}
				onEventScoreSortChange={handleEventScoreSortChange}
				continents={rankings.data.continents}
				countries={rankings.data.countries}
			/>
		</div>
	);
}

interface KinchEventTableProps {
	kinchRank: KinchRank,
	filters: AppFilters,
	eventScoreSort: "event" | "score",
	onEventScoreSortChange: (sort: "event" | "score") => void,
	continents: Continent[],
	countries: Country[],
};

function KinchEventTable(props: KinchEventTableProps) {
	const {
		kinchRank,
		filters,
		eventScoreSort,
		onEventScoreSortChange,
		continents,
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
				{kinchEvents.map(
					kinchEvent => KinchEventRow({
						kinchEvent: kinchEvent,
						filters: filters,
						continents: continents,
					})
				)}
			</tbody>
		</table>
	);
}

interface KinchEventRowProps {
	kinchEvent: KinchEvent,
	filters: AppFilters,
	continents: Continent[],
};

function KinchEventRow(props: KinchEventRowProps) {
	const {
		kinchEvent,
		filters,
		continents,
	} = props;
	const {eventName, score, result, type} = kinchEvent;

	let rowClass = "";
	if (score >= 100) {
		rowClass = "top-score";
	} else if (score >= 90) {
		rowClass = "high-score";
	} else if (score >= 80) {
		rowClass = "good-score";
	}

	let resultOut;
	if (result) {
		const rankingsBaseURL = "https://wca-seniors.org/Senior_Rankings.html";

		let regionCode = "";
		if (filters.region !== "world") {
			if (continents.some(c => c.id === filters.region)) {
				regionCode = `-${filters.region}`;
			} else {
				regionCode = `-xx-${filters.region}`;
			}
		}
		const rankingURL = `${rankingsBaseURL}#${kinchEvent.eventID}-${type}-${filters.age}${regionCode}`;

		let resultType = "";
		if (kinchEvent.eventID !== "333mbf" && !scoreAverageOnly[kinchEvent.eventID]) {
			resultType = type === "single" ? " (sing)" : " (avg)";
		}
		resultOut = (
			<span>
				<a href={rankingURL} target="_blank">
					{result} {resultType}
				</a>
			</span>
		);
	} else {
		resultOut = "--";
	}

	return (
		<tr class={rowClass}>
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

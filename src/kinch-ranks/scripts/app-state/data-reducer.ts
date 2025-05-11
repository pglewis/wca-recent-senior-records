import {EventRanking, WCAEvent} from "../../../common/scripts/rankings-snapshot";
import {parseMultiResult, timeResultToSeconds} from "../../../common/scripts/util/parse";
import {KinchEvent, KinchRank, TopRank} from "../types";
import {AppData, AppFilters, Rankings} from "./app-state";
import {
	AppActionTypes,
	AppAction,
	TopRanksSetAction,
	KinchRanksUpdatedAction,
} from "./app-actions";

const useAverage = {
	"333": true,
	"222": true,
	"444": true,
	"555": true,
	"666": true,
	"777": true,
	"333bf": false,
	"333fm": false,
	"333oh": true,
	"clock": true,
	"minx": true,
	"pyram": true,
	"skewb": true,
	"sq1": true,
	"444bf": false,
	"555bf": false,
	"333mbf": false,
};

export function setTopRanksAction(rankings: Rankings): TopRanksSetAction {
	return {
		type: AppActionTypes.topRanksSet,
		payload: rankings
	};
}

export function setKinchRanksAction(rankings: Rankings, topRanks: AppData["topRanks"], filters: AppFilters): KinchRanksUpdatedAction {
	return {
		type: AppActionTypes.updateKinchRanks,
		payload: {
			rankings: rankings,
			topRanks: topRanks,
			filters: filters
		}
	};
}

export function dataReducer(data: AppData, action: AppAction): AppData {
	const {type, payload} = action;

	switch (type) {
		case AppActionTypes.topRanksSet: {
			return {
				...data,
				topRanks: buildTopRanks(payload)
			};
		}
		case AppActionTypes.updateKinchRanks: {
			const {rankings, topRanks, filters} = payload;

			let allRanks = rankings.data.persons.map(p => getRanksForPerson(rankings, topRanks, filters, p.id));
			allRanks = allRanks.filter(r => r.overall > 0);
			allRanks.sort((a, b) => b.overall - a.overall);

			return {
				...data,
				kinchRanks: allRanks
			};
		}
	}

	return data;
};

export function buildTopRanks(rankings: Rankings): TopRank[] {
	const rankingsData = rankings.data;
	const topRanks = [];

	// format (time, number, multi), id (eg "333"), name ("3x3x3 Cube")
	for (const event of rankingsData.events) {

		// type (single/average) and age(40, 50, etc)
		for (const eventRanking of event.rankings) {
			const {age, ranks} = eventRanking;

			if (ranks.length === 0 || (useAverage[event.id] && eventRanking.type !== "average")) {
				continue;
			}

			topRanks.push({
				eventId: event.id,
				type: eventRanking.type,
				age: age,
				result: ranks[0].best
			});
		}
	}

	return topRanks;
}

// getRanksForPerson(rankings, topRanks, filters, p.id)
export function getRanksForPerson(rankings: Rankings, topRanks: TopRank[], filters: AppFilters, personId: string): KinchRank {
	const rankingsData = rankings.data;
	const person = rankingsData.persons.find(p => p.id === personId);
	if (!person) {
		throw new Error(`We were looking for someone's rankings but WCA ID "${personId}" was not found.`);
	}

	const kinchRanks = {
		personId: personId,
		personName: person.name,
		overall: 0,
		events: [] as KinchEvent[]
	};

	for (const event of rankingsData.events) {
		if (!person.events.includes(event.id)) {
			// They've never competed in this event at all
			kinchRanks.events.push({
				id: event.id,
				eventName: event.name,
				score: 0,
				result: ""
			});
		} else if (event.id === "333mbf") {
			// Multi blind is a special case
			kinchRanks.events.push(getPersonMultiScore(topRanks, person.id, event, filters.age));
		} else if (useAverage[event.id]) {
			// Use the average
			kinchRanks.events.push(getPersonAverageScore(topRanks, person.id, event, filters.age));
		} else {
			// best of single or average
			kinchRanks.events.push(getPersonSingeleOrAverageScore(topRanks, person.id, event, filters.age));
		}
	}

	kinchRanks.overall = kinchRanks.events.reduce((acc, current) => acc + current.score, 0) / kinchRanks.events.length;
	return kinchRanks;
}

function getTopRank(topRanks: TopRank[], eventId: string, type: EventRanking["type"], age: number): TopRank | undefined {
	const topRank = topRanks.find(r =>
		r.eventId === eventId
		&& r.type === type
		&& r.age === age
	);

	return topRank;
}

function getPersonResult(event: WCAEvent, type: EventRanking["type"], personId: string, age: number): string | undefined {
	const eventRanking = event.rankings.find(r => r.type === type && r.age === age);
	if (!eventRanking) {
		return undefined;
	}

	const rank = eventRanking.ranks.find(r => r.id === personId);
	if (!rank) {
		return undefined;
	}

	return rank.best;
}

function getPersonAverageScore(topRanks: TopRank[], personId: string, event: WCAEvent, age: number): KinchEvent {
	const topRank = getTopRank(topRanks, event.id, "average", age);
	const result = getPersonResult(event, "average", personId, age);

	if (!result || !topRank) {
		return {
			id: event.id,
			eventName: event.name,
			score: 0,
			result: ""
		};
	}

	return {
		id: event.id,
		eventName: event.name,
		score: getPersonScore(event.format, topRank, result),
		result: result
	};
}

function getPersonSingeleOrAverageScore(topRanks: TopRank[], personId: string, event: WCAEvent, age: number): KinchEvent {
	const singleTopRank = getTopRank(topRanks, event.id, "single", age);
	const averageTopRank = getTopRank(topRanks, event.id, "average", age);
	const singleResult = getPersonResult(event, "single", personId, age);
	const averageResult = getPersonResult(event, "average", personId, age);

	if (!singleResult || !singleTopRank) {
		// We can end up here if they've competed in the event but not in this age bracket
		return {
			id: event.id,
			eventName: event.name,
			score: 0,
			result: ""
		};
	}

	let result: string;
	let score = 0;
	const singleScore = getPersonScore(event.format, singleTopRank, singleResult);
	if (averageResult && averageTopRank) {
		const averageScore = getPersonScore(event.format, averageTopRank, averageResult);

		// They have both a single and average, pick the best score of the two
		if (singleScore > averageScore) {
			score = singleScore;
			result = singleResult;
		} else {
			score = averageScore;
			result = averageResult;
		}
	} else {
		score = singleScore;
		result = singleResult;
	}

	return {
		id: event.id,
		eventName: event.name,
		score: score,
		result: result
	};
}

function getPersonScore(format: WCAEvent["format"], topRank: TopRank, result: string) {
	if (format === "time") {
		return (timeResultToSeconds(topRank.result) / timeResultToSeconds(result)) * 100;
	} else {
		return (Number(topRank.result) / Number(result)) * 100;
	}
}

function getPersonMultiScore(topRanks: TopRank[], personId: string, event: WCAEvent, age: number): KinchEvent {
	const topRank = getTopRank(topRanks, event.id, "single", age); // We just use single for mbld
	const result = getPersonResult(event, "single", personId, age);

	if (!result || !topRank) {
		return {
			id: event.id,
			eventName: event.name,
			score: 0,
			result: ""
		};
	}

	// Bigger result is better for mbld, so the division is reversed
	return {
		id: event.id,
		eventName: event.name,
		score: (getKinchMultiScore(result) / getKinchMultiScore(topRank.result)) * 100,
		result: result
	};
}

function getKinchMultiScore(result: string) {
	const multiResult = parseMultiResult(result);
	return multiResult.score + 1 - multiResult.seconds / (60 * 60);
}

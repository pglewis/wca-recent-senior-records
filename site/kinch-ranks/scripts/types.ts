import {WCAEventID, EventRanking} from "@repo/lib/types/rankings-snapshot";

export interface TopRank {
	eventID: string,
	type: "single" | "average",
	age: number,
	region: string,
	result: string,
};

export interface KinchRank {
	personID: string,
	personName: string,
	overall: number,
	events: KinchEvent[],
};

export interface KinchEvent {
	eventID: WCAEventID,
	eventName: string,
	score: number,
	result: string,
	type: EventRanking["type"] | null,
};

import {WCAEventID} from "../../common/scripts/rankings-snapshot";

export interface TopRank {
	eventId: string;
	type: "single" | "average";
	age: number;
	result: string;
}

export interface KinchEvent {
	id: WCAEventID;
	eventName: string;
	score: number;
	result: string;
}

export interface KinchRank {
	personId: string;
	personName: string;
	overall: number;
	events: KinchEvent[];
}

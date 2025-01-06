export type RankingsSnapshot = {
	/** Human readable date/time string of the data snapshot, in UTC */
	refreshed: string
	events: WCAEvent[]
	persons: Person[]
	competitions: Competition[]
	continents: Continent[]
	countries: Country[]
}

export type WCAEvent = {
	/** eg 333bf */
	id: string

	/** eg 3x3x3 Blindfolded */
	name: string

	/** The format used for the result */
	format: "time" | "number" | "multi"

	rankings: EventRanking[]
}

export type EventRanking = {
	/** single, average */
	type: "single" | "average"

	/** The age group for this ranking (40, 50, 60, ...) */
	age: number

	/** TODO: needs documentation */
	missing: object

	ranks: Rank[]
}

export type Rank = {
	/** estimated numeric rank (considers missing records) */
	rank: number

	/** Competitor's WCA ID */
	id: Person["id"]

	/**
	 * Event result. Format may be a time duration, number (for fewest moves
	 * competition), or multi ("X/Y in MM:SS") as specified by the event format
	 */
	best: string

	/** Competition ID */
	competition: Competition["id"]

	/** Sometimes included, opt-in */
	age?: number | null
}

export type Competition = {
	/** Competition ID */
	id: number

	/** Competition web ID for linking */
	webId: string

	/** Competition full name */
	name: string

	/** 2 character country code */
	country: Country["id"]

	/** competition start date, UTC YYYY-MM-DD */
	startDate: string
}

export type Continent = {
	/** 2 character continent code */
	id: string

	/** Display name */
	name: string
}

export type Country = {
	/** 2 character country code */
	id: string

	/** Display name */
	name: string

	/** 2 character continent code */
	continent: Continent["id"]
}

export type Person = {
	/** Competitor's WCA ID */
	id: string

	/** Competitor's full name */
	name: string

	/** 2 character country code */
	country: Country["id"]

	/** 40, 50, 60, ... */
	age: string

	/** Array of event IDs competed in */
	events: WCAEvent["id"][]
}

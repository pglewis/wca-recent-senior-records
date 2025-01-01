export type RankingsSnapshot = {
	/** date/time string of the data snapshot in UTC */
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

	/** time, number, multi */
	format: 'time' | 'number' | 'multi'

	rankings: EventRanking[]
}

export type EventRanking = {
	/** single, average */
	type: 'single' | 'average'

	age: string

	ranks: Rank[]

	/** TODO: needs documentation */
	missing: object
}
export type Rank = {
	/** estimated numeric rank (considers missing records) */
	rank: string

	id: Person["id"]

	/** the result */
	best: string

	/** Competition ID */
	competition: string

	/** Sometimes included, opt-in */
	age: string | null
}

export type Competition = {
	id: string
	webId: string
	name: string

	/** 2 character code */
	country: string

	/** competition start date, UTC YYYY-MM-DD */
	startDate: string
}

export type Continent = {
	id: string
	name: string
}

export type Country = {
	id: string
	name: string
	continent: string
}

export type Person = {
	/** WCA ID */
	id: string

	/** Full name */
	name: string

	/** 2 character code */
	country: string

	/** 40, 50, 60, ... */
	age: string

	/** Array of event IDs competed in */
	events: string[]
}

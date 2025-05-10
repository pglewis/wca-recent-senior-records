export type Action<T extends string = string> = {
	type: T
}

export interface UnknownAction extends Action {
	// Allows any extra properties to be defined in an action.
	[extraProps: string]: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ActionCreator<A, P extends any[] = any[]> {
	(...args: P): A
}

/**
 * Object whose values are action creator functions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ActionCreatorsMapObject<A = any, P extends any[] = any[]> {
	[key: string]: ActionCreator<A, P>
}

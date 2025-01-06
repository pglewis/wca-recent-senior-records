import {DataStore} from "../state/state"

export interface AppProps {
	store: DataStore,
	/** Callback to trigger a re-render of the UI */
	handleRender: Function
}

export declare function App(props: AppProps): HTMLElement[]
export declare function Loading(): HTMLElement
export declare function ErrorMessage(message: string): HTMLElement

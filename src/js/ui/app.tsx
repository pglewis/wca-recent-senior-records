// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import type {AppProps} from "../app-state/app-state";
import {Info} from "./info";
import {Panel} from "./panel";
import {Results} from "./results";

export function App(props: AppProps): JSX.Element {
	const results = props.store.getState().results;

	return (
		<div>
			<Info {...props} />
			<Panel {...props} />
			<div class="strong">Showing {results.length} {results.length === 1 ? "result" : "results"}</div>
			<Results {...props} />
		</div>
	);
}

export function Loading(): JSX.Element {
	return (
		<h3 class="message">Loading... please wait</h3>
	);
}

export function ErrorMessage(message: string): JSX.Element {
	return (
		<div class="error">
			<h3>Something went wrong &trade;</h3>
			<div class="message">{message}</div>
		</div>
	);
}

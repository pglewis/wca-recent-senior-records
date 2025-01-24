// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {type AppProps} from "../app-state/app-state";
import {Info} from "./info";
import {Panel} from "./panel";
import {Results} from "./results";

export function App(props: AppProps): JSX.Element {
	return (
		<div>
			<Info {...props} />
			<Panel {...props} />
			<Results {...props} />
		</div>
	);
}

export function Loading(): JSX.Element {
	return (
		<h3 class="no-results">No results</h3>
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

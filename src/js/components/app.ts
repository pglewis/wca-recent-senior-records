import {type AppState} from "../app-state/app-state";
import {type DataStore} from "../state/state";
import {getTemplateElement} from "./get-template-element";
import {getTemplatePart} from "./get-template-part";
import {Info} from "./info";
import {Panel} from "./panel";
import {Results} from "./results";

export interface AppProps {
	store: DataStore<AppState>,

	/** Callback to trigger a re-render of the UI */
	handleRender: () => void
}

export function App(props: AppProps): HTMLElement[] {
	const nodes: HTMLElement[] = [];

	nodes.push(Info(props), Panel(props), Results(props));

	return nodes;
}

export function Loading(): HTMLElement {
	return getTemplateElement("#loading-template");
}

export function ErrorMessage(message: string): HTMLElement {
	const errorMessage = getTemplateElement("#error-template");
	const messageNode = getTemplatePart(errorMessage, ".message");

	messageNode.textContent = message;

	return errorMessage;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {SelectOptions, type SelectOption} from "./select-options";
import {setEventFilterAction} from "../app-state/filters-reducer";

export function EventFilter(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {event: eventFilter} = store.getState().filters;

	const optionArray: SelectOption[] = [];
	for (const thisEvent of store.getState().rankings.data.events) {
		optionArray.push({label: thisEvent.name, value: thisEvent.id});
	}

	function handleEventFilterChange(this: HTMLSelectElement) {
		store.dispatch(setEventFilterAction(this.value));
		handleRender();
	}

	return (
		<div>
			<label class="strong">Event:</label>
			<select id="event-filter" onChange={handleEventFilterChange}>
				<option value="">All Events</option>
				{SelectOptions(optionArray, eventFilter)}
			</select>
		</div>
	);
}

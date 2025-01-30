// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {SelectOptions, type SelectOption} from "./select-options";
import {setEventTypeFilterAction} from "../app-state/filters-reducer";
import {EventRanking} from "../rankings-snapshot";

interface EventTypeOption extends SelectOption {
	value: EventRanking["type"]
}

export function EventTypeFilter(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {eventType: eventTypeFilter} = store.getState().filters;

	function handleEventFilterChange(this: HTMLSelectElement) {
		//--!! duct-tape: tsx-dom cannot use empty string as the value
		const value = this.value !== "xx" ? this.value as EventRanking["type"] : "";
		store.dispatch(setEventTypeFilterAction(value));
		handleRender();
	}

	const optionArray: EventTypeOption[] = [
		{label: "Single", value: "single"},
		{label: "Average", value: "average"}
	];

	return (
		<div>
			<label class="strong">
				Ranking type:&nbsp;
				<select id="event-type-filter" onChange={handleEventFilterChange}>
					<option value="xx">Any</option>
					{SelectOptions(optionArray, eventTypeFilter)}
				</select>
			</label>
		</div>
	);
}

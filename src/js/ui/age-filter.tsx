// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {SelectOptions, type SelectOption} from "./select-options";
import {setAgeFilterAction} from "../app-state/filters-reducer";
import {EventRanking} from "../rankings-snapshot";

export function AgeFilter(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {age: ageFilter} = store.getState().filters;

	function handleEventFilterChange(this: HTMLSelectElement) {
		//--!! duct-tape: tsx-dom cannot use empty string as the value
		const value = this.value !== "xx" ? Number(this.value) as EventRanking["age"] : "";
		store.dispatch(setAgeFilterAction(Number(value)));
		handleRender();
	}

	const optionArray: SelectOption[] = [
		{label: "Over 40", value: "40"},
		{label: "Over 50", value: "50"},
		{label: "Over 60", value: "60"},
		{label: "Over 70", value: "70"},
		{label: "Over 80", value: "80"},
		{label: "Over 90", value: "90"}
	];

	return (
		<div>
			<label class="strong">
				Age:&nbsp;
				<select id="age-filter" onChange={handleEventFilterChange}>
					{SelectOptions(optionArray, ageFilter)}
				</select>
			</label>
		</div>
	);
}

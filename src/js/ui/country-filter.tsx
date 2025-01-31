// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import type {AppProps} from "../app-state/app-state";
import {setCountryFilterAction} from "../app-state/filters-reducer";
import {SelectOptions, type SelectOption} from "./select-options";

export function CountryFilter(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const countries = store.getState().rankings.data.countries;
	const activeCountries = store.getState().rankings.activeRegions.countries;
	const countryFilter = store.getState().filters.country;
	const continentFilter = store.getState().filters.continent;

	function handleChange(this: HTMLSelectElement) {
		//--!! More effin' duct-tape: tsx-dom cannot use empty string as the value
		const value = this.value !== "xx" ? this.value : "";
		store.dispatch(setCountryFilterAction(value));
		handleRender();
	}

	const filteredCountries = countries
		.filter(c => activeCountries.has(c.id))
		.filter(c => continentFilter === "" || c.continent === continentFilter)
		;

	const optionArray: SelectOption[] = [];
	for (const country of filteredCountries) {
		optionArray.push({label: country.name, value: country.id});
	}

	return (
		<div>
			<label class="strong">Country:</label>
			<select id="country-filter" onChange={handleChange}>
				<option value="xx">All Countries</option>
				{SelectOptions(optionArray, countryFilter)}
			</select>
		</div>
	);
}

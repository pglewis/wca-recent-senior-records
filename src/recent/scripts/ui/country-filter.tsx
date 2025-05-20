// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import type {AppProps} from "../app-state/app-state";
import {setCountryFilterAction} from "../app-state/filters-reducer";
import {SelectOptions, type SelectOption} from "./select-options";

export function CountryFilter(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {rankings, filters} = store.getState();
	const countries = rankings.data.countries;
	const activeCountries = new Set(rankings.activeRegions.countries);
	const countryFilter = filters.country;
	const continentFilter = filters.continent;

	function handleChange(this: HTMLSelectElement) {
		store.dispatch(setCountryFilterAction(this.value));
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
				<option value="">All Countries</option>
				{SelectOptions(optionArray, countryFilter)}
			</select>
		</div>
	);
}

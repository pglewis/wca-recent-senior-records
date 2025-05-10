// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import type {AppProps} from "../app-state/app-state";
import {setContinentFilterAction} from "../app-state/filters-reducer";
import {SelectOptions, type SelectOption} from "./select-options";
import {Continent} from "../../../common/scripts/rankings-snapshot";

export function ContinentFilter(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {rankings, filters} = store.getState();
	const {continent: continentFilter, country: countryFilter} = filters;
	const {countryIDToIndex} = rankings;
	const {continents, countries} = rankings.data;
	const activeContinents = rankings.activeRegions.continents;
	const optionArray: SelectOption[] = [];

	function handleChange(this: HTMLSelectElement) {
		store.dispatch(setContinentFilterAction(this.value));
		handleRender();
	}

	let filteredContinents: Continent[];
	if (countryFilter) {
		const selectedCountry = countries[countryIDToIndex[countryFilter]];
		filteredContinents = continents.filter(c => selectedCountry.continent === c.id);
	} else {
		filteredContinents = continents.filter(c => activeContinents.has(c.id));
	}

	for (const continent of filteredContinents) {
		optionArray.push({label: continent.name, value: continent.id});
	}

	return (
		<div>
			<label class="strong">Continent:</label>
			<select id="continent-filter" onChange={handleChange}>
				<option value="">All Continents</option>
				{SelectOptions(optionArray, continentFilter)}
			</select>
		</div>
	);
}

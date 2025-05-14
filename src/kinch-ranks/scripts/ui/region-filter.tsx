// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {Continent, Country} from "../../../common/scripts/rankings-snapshot";
import {AppProps} from "../app-state/app-state";
import {setRegionFilterAction} from "../app-state/filters-reducer";
import {getURLState, updateURLState} from "../url-state";

export function RegionFilter(props: AppProps) {
	const {store, handleRender} = props;
	const state = store.getState();
	const rankings = state.rankings;
	const topRanks = state.data.topRanks;
	const filters = state.filters;
	const {continents, countries, persons} = rankings.data;
	const {continents: activeContinents, countries: activeCountries} = rankings.activeRegions;
	const {region: currentRegion, wcaid} = filters;

	let filteredContinents: Continent[];
	let filteredCountries: Country[];
	if (wcaid) {
		// Personal ranks page, only show "world" and their regions
		const person = persons[rankings.personIDToIndex[wcaid]];
		const country = countries[rankings.countryIDToIndex[person.country]];
		const continent = continents.find(c => c.id === country.continent) as Continent;

		filteredContinents = continents.filter(c => c.id === continent.id);
		filteredCountries = countries.filter(c => c.id === country.id);
	} else {
		// Filter out continents/countries that do not have any results for the current filters
		filteredContinents = continents.filter(c =>
			activeContinents.has(c.id)
			&& topRanks.some(tr => tr.age === filters.age && tr.region === c.id)
		);
		filteredCountries = countries.filter(c =>
			activeCountries.has(c.id)
			&& topRanks.some(tr => tr.age === filters.age && tr.region === c.id)
		);
	}

	function handleChange(this: HTMLSelectElement) {
		store.dispatch(setRegionFilterAction(this.value));
		updateURLState({...getURLState(), ...{region: this.value}});
		handleRender();
	}

	return (
		<div class="region-filter">
			<select id="region-filter" onChange={handleChange}>
				<option value="world">World</option>
				<optgroup label="Continents">
					{Array.from(filteredContinents).map(
						c => ContinentOption(c.id, c.name, currentRegion)
					)}
				</optgroup>
				<optgroup label="Countries">
					{Array.from(filteredCountries).sort().map(
						c => CountryOption(c.id, c.name, currentRegion)
					)}
				</optgroup>
			</select>
		</div>
	);
}

function ContinentOption(continentID: string, continentName: string, currentRegion: string) {
	return (
		<option value={`${continentID}`} selected={continentID === currentRegion}>
			{continentName}
		</option>
	);
}

function CountryOption(countryID: string, countryName: string, currentRegion: string) {
	return (
		<option value={`${countryID}`} selected={countryID === currentRegion}>
			{countryName}
		</option>
	);
}

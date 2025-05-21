// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {TopRank} from "../types";
import {getURLState, updateURLState} from "../url-state";
import {AppFilters, AppProps} from "../app-state/app-state";
import {
	setAgeFilterAction,
	setPageFilterAction,
	setWCAIDFilterAction,
} from "../app-state/filters-reducer";
import {setSearchFilterAction} from "../app-state/ui-state-reducer";
import {Search} from "./search";
import {AgeFilter} from "./age-filter";
import {RegionFilter} from "./region-filter";
import {Pagination} from "../../../../lib/ui/pagination";

export function Parameters(props: AppProps) {
	const {store, handleRender} = props;
	const state = store.getState();
	const filters = state.filters;

	const records = state.data.kinchRanks.length;
	const totalPages = Math.ceil(records / filters.rowsPerPage);

	const handleAgeChange = function(newAge: number) {
		store.dispatch(setAgeFilterAction(newAge));
		store.dispatch(setPageFilterAction(1));
		updateURLState({...getURLState(), ...{age: newAge, page: 1}});
		handleRender();
	};

	const handlePageChange = function(newPage: number) {
		store.dispatch(setPageFilterAction(newPage));
		updateURLState({...getURLState(), ...{page: newPage}});
		handleRender();
	};

	const handleSearchChange = function(newSearch: string) {
		store.dispatch(setSearchFilterAction(newSearch));
		handleRender();
	};

	const handleSearchSelect = function(personID: string) {
		store.dispatch(setSearchFilterAction(""));
		store.dispatch(setWCAIDFilterAction(personID));
		updateURLState({...getURLState(), ...{wcaid: personID}});
		handleRender();
	};

	const ageList = getAgeList(state.data.topRanks, filters);

	return (
		<div class="parameters">
			<Search
				searchTerm={state.uiState.userInputState.searchTerm}
				kinchRanks={state.data.kinchRanks}
				onChange={handleSearchChange}
				onSelect={handleSearchSelect}
			/>

			<AgeFilter age={filters.age} ageList={ageList} onAgeChange={handleAgeChange} />

			<RegionFilter {...props} />

			{(totalPages > 1 && !filters.wcaid)
				? (<Pagination
					currentPage={filters.page}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>)
				: ""
			}
		</div>
	);
}

function getAgeList(topRanks: TopRank[], filters: AppFilters): number[] {
	return Array.from(
		new Set(
			topRanks
				.filter(tr => tr.region === filters.region)
				.map(tr => tr.age)
		)
	).sort((a, b) => a - b);
}

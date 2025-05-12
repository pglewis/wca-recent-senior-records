// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {AgeFilter} from "./age-filter";
import {Pagination} from "../../../common/scripts/ui/pagination";
import {setAgeFilterAction, setPageFilterAction, setWCAIDFilterAction} from "../app-state/filters-reducer";
import {Search} from "./search";
import {getURLState, updateURLState} from "../url-state";
import {setSearchFilterAction} from "../app-state/ui-state-reducer";

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

	const handleSearchSelect = function(personId: string) {
		store.dispatch(setSearchFilterAction(""));
		store.dispatch(setWCAIDFilterAction(personId));
		updateURLState({...getURLState(), ...{wcaid: personId}});
		handleRender();
	};

	return (
		<div class="parameters">
			<AgeFilter age={filters.age} onAgeChange={handleAgeChange} />
			<Search
				searchTerm={state.uiState.userInputState.searchTerm}
				kinchRanks={state.data.kinchRanks}
				onChange={handleSearchChange}
				onSelect={handleSearchSelect}
			/>
			{(totalPages > 1 && !filters.wcaid) ?
				(<Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />) : ""
			}
		</div>
	);
}

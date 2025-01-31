// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {Search} from "./search";
import {EventFilter} from "./event-filter";
import {ContinentFilter} from "./continent-filter";
import {CountryFilter} from "./country-filter";
import {Parameters} from "./parameters";
import {SortColumnList} from "./sort-column-list";
import {EventTypeFilter} from "./event-type-filter";
import {AgeFilter} from "./age-filter";

export function Panel(props: AppProps): JSX.Element {
	return (
		<div id="panel">
			<div class="panel-grid">
				<Parameters {...props} />
				<DropDownFilters {...props} />
				<SortColumnList {...props} />
			</div>
		</div>
	);
}

function DropDownFilters(props: AppProps): JSX.Element {
	return (
		<div id="dropdown-filters">
			<EventFilter {...props} />
			<EventTypeFilter {...props} />
			<AgeFilter {...props} />
			<ContinentFilter {...props} />
			<CountryFilter {...props} />
			<Search {...props} />
		</div>
	);
}

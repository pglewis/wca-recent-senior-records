// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {SortColumnList} from "./sort-column-list";
import {Search} from "./search";
import {Parameters} from "./parameters";

export function Panel(props: AppProps): JSX.Element {
	return (
		<div id="panel">
			<div class="panel-grid">
				<Search {...props} />
				<Parameters {...props} />
				<SortColumnList {...props} />
			</div>
		</div>
	);
}

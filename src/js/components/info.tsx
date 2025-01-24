// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";

export function Info(props: AppProps): JSX.Element {
	const {store} = props;
	const {results} = store.getState();
	const {lastUpdated} = store.getState().rankings;
	const {topN, timeFrame, search} = store.getState().filters;

	return (
		<div id="info">
			<p class="refreshed">Last refreshed: {lastUpdated} (UTC)</p>
			<p class="result-info">
				Showing {results.length} {results.length === 1 ? "result" : "results"}
				{search ? ' matching "' + search + '"' : " "}
				in the top {topN} set in the past {timeFrame} day(s)
			</p>
			<p>
				Drag the columns in the sort column list to rearrange the sort order. Column
				headers can be dragged to the list to change the sort columns.
				You can also click a column header to set the primary sort, ctrl-click to set the
				secondary sort, and ctrl+shift-click to set the tertiary sort.
			</p>
		</div>
	);
}

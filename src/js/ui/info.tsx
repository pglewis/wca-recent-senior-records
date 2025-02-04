// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import type {RankingsSnapshot} from "../rankings-snapshot";

interface Props {
	lastUpdated: RankingsSnapshot["refreshed"]
};

export function Info(props: Props): JSX.Element {
	return (
		<div id="info">
			<p class="refreshed">Last refreshed: {props.lastUpdated} (UTC)</p>
			<p>
				Drag the columns in the sort column list to rearrange the sort order. Column
				headers can be dragged to the list to change the sort columns.
				You can also click a column header to set the primary sort, ctrl-click to set the
				secondary sort, and ctrl+shift-click to set the tertiary sort.
			</p>
		</div>
	);
}

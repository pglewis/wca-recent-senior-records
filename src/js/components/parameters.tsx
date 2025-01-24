// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {setTopNAction, setRecentInDaysAction} from "../app-state/filters-reducer";

export function Parameters(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {timeFrame, topN} = store.getState().filters;

	/* Time frame select box */
	function handleTimeFrameChange(e: Event) {
		const select = e.currentTarget as HTMLSelectElement;
		store.dispatch(setRecentInDaysAction(Number(select.value)));
		handleRender();
	}

	/* Top N select box */
	function handleTopNChange(e: Event) {
		const select = e.currentTarget as HTMLSelectElement;
		store.dispatch(setTopNAction(Number(select.value)));
		handleRender();
	};

	return (
		<div id="parameters">
			<div>
				<label class="strong">
					Show the top&nbsp;
					<select id="top-n" onChange={handleTopNChange}>
						<option value="5" selected={topN === 5}>5</option>
						<option value="10" selected={topN === 10}>10</option>
						<option value="25" selected={topN === 25}>25</option>
						<option value="50" selected={topN === 50}>50</option>
					</select>
				</label>
				<label class="strong">
					&nbsp;in the past&nbsp;
					<select id="time-frame" onChange={handleTimeFrameChange}>
						<option value="7" selected={timeFrame === 7}>7 days</option>
						<option value="14" selected={timeFrame === 14}>14 days</option>
						<option value="30" selected={timeFrame === 30}>30 days</option>
						<option value="60" selected={timeFrame === 60}>60 days</option>
						<option value="90" selected={timeFrame === 90}>90 days</option>
					</select>
				</label>
			</div>
		</div>
	);
}

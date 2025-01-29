// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import type {AppProps, Filters} from "../app-state/app-state";
import {setTopNAction, setTimeFrameAction, setRegionAction} from "../app-state/filters-reducer";

interface Option {
	value: string
	label: string
}

interface RegionOption extends Option {
	value: Filters["region"]
}

const topNOptions: Option[] = [
	{value: "5", label: "5"},
	{value: "10", label: "10"},
	{value: "25", label: "25"},
	{value: "50", label: "50"},
];

const regionOptions: RegionOption[] = [
	{value: "world", label: "WR"},
	{value: "continent", label: "CR"},
	{value: "country", label: "NR"},
];

const timeFrameOptions: Option[] = [
	{value: "7", label: "7 days"},
	{value: "14", label: "14 days"},
	{value: "30", label: "30 days"},
	{value: "60", label: "60 days"},
	{value: "90", label: "90 days"},
];

export function Parameters(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {timeFrame, topN, region} = store.getState().filters;

	function handleTimeFrameChange(this: HTMLSelectElement) {
		store.dispatch(setTimeFrameAction(Number(this.value)));
		handleRender();
	}

	function handleTopNChange(this: HTMLSelectElement) {
		store.dispatch(setTopNAction(Number(this.value)));
		handleRender();
	}

	function handleRegionChange(this: HTMLSelectElement) {
		store.dispatch(setRegionAction(this.value as Filters["region"]));
		handleRender();
	}

	return (
		<div id="parameters">
			<label class="strong">
				Top:&nbsp;
				<select id="top-n" onChange={handleTopNChange}>
					{SelectOptions(topNOptions, topN)}
				</select>
			</label>
			<label class="strong">
				&nbsp;&nbsp;Type:&nbsp;
				<select id="region" onChange={handleRegionChange}>
					{SelectOptions(regionOptions, region)}
				</select>
			</label>
			<label class="strong">
				&nbsp;&nbsp;Time frame:&nbsp;
				<select id="time-frame" onChange={handleTimeFrameChange}>
					{SelectOptions(timeFrameOptions, timeFrame)}
				</select>
			</label>
		</div>
	);
}

function SelectOptions(options: Option[], selected: string | number): JSX.Element[] {
	return options.map(option =>
		<option value={option.value} selected={option.value == selected}>{option.label}</option>
	);
}

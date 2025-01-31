// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import type {AppProps, Filters} from "../app-state/app-state";
import {setTopNAction, setTimeFrameAction, setRankingTypeAction} from "../app-state/filters-reducer";
import {SelectOptions, type SelectOption} from "./select-options";

interface RankingTypeOption extends SelectOption {
	value: Filters["rankingType"]
}

const topNOptions: SelectOption[] = [
	{value: "5", label: "5"},
	{value: "10", label: "10"},
	{value: "25", label: "25"},
	{value: "50", label: "50"},
];

const rankingTypeOptions: RankingTypeOption[] = [
	{value: "wr", label: "World (WR)"},
	{value: "cr", label: "Continent (CR)"},
	{value: "nr", label: "National (NR)"},
];

const timeFrameOptions: SelectOption[] = [
	{value: "7", label: "7 days"},
	{value: "14", label: "14 days"},
	{value: "30", label: "30 days"},
	{value: "60", label: "60 days"},
	{value: "90", label: "90 days"},
];

export function Parameters(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {timeFrame, topN, rankingType} = store.getState().filters;

	function handleTimeFrameChange(this: HTMLSelectElement) {
		store.dispatch(setTimeFrameAction(Number(this.value)));
		handleRender();
	}

	function handleTopNChange(this: HTMLSelectElement) {
		store.dispatch(setTopNAction(Number(this.value)));
		handleRender();
	}

	function handleRankingTypeChange(this: HTMLSelectElement) {
		store.dispatch(setRankingTypeAction(this.value as Filters["rankingType"]));
		handleRender();
	}

	return (
		<div id="parameters">
			<div>
				<label class="strong">Show Top:</label>
				<select id="top-n" onChange={handleTopNChange}>
					{SelectOptions(topNOptions, topN)}
				</select>
			</div>
			<div>
				<label class="strong">Ranking Type:</label>
				<select id="ranking-type-filter" onChange={handleRankingTypeChange}>
					{SelectOptions(rankingTypeOptions, rankingType)}
				</select>
			</div>
			<div>
				<label class="strong">Time frame:</label>
				<select id="time-frame" onChange={handleTimeFrameChange}>
					{SelectOptions(timeFrameOptions, timeFrame)}
				</select>
			</div>
		</div>
	);
}

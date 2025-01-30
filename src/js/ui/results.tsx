// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import type {AppProps, ResultRow} from "../app-state/app-state";
import {updateSortColumnsAction} from "../app-state/sort-columns-reducer";
import {handleDragStart, handleDragEnd} from "./sort-column-list";

type ColumnHeader = {
	name: string
	label: string
	defaultSortDirection: -1 | 1 | null
};

const headers: ColumnHeader[] = [
	{name: "date", label: "Date", defaultSortDirection: -1},
	{name: "event", label: "Event", defaultSortDirection: 1},
	{name: "group", label: "Group", defaultSortDirection: 1},
	{name: "rank", label: "Rank", defaultSortDirection: 1},
	{name: "name", label: "Name", defaultSortDirection: 1},
	{name: "result", label: "Result", defaultSortDirection: 1},
	{name: "competition", label: "Competition", defaultSortDirection: null}
];

export function Results(props: AppProps): JSX.Element {
	const {results} = props.store.getState();

	if (!results || results.length === 0) {
		return NoResults();
	}

	return ResultsTable(props);
}

function ResultsTable(props: AppProps): JSX.Element {
	const {results} = props.store.getState();
	const tableRows: JSX.Element[] = [];

	for (const resultRow of results) {
		tableRows.push(<TableRow rowData={resultRow} appProps={props} />);
	}

	return (
		<table id="ranking-table" class="rankings sortable">
			<thead>
				<TableHeaderRow headers={headers} appProps={props} />
			</thead>
			<tbody>
				{tableRows}
			</tbody>
		</table>
	);
}

function TableHeaderRow(props: {headers: ColumnHeader[], appProps: AppProps}): JSX.Element {
	const {headers, appProps} = props;
	const tableHeaders: JSX.Element[] = [];

	for (const thisHeader of headers) {
		tableHeaders.push(<TableHeader columnHeader={thisHeader} appProps={appProps} />);
	}

	return (
		<tr>
			{tableHeaders}
		</tr>
	);
}

function TableHeader(props: {columnHeader: ColumnHeader, appProps: AppProps}): JSX.Element {
	const {columnHeader, appProps} = props;

	if (columnHeader.defaultSortDirection === null) {
		return (<HeaderNoSort columnHeader={columnHeader} />);
	}

	return (<HeaderSortable columnHeader={columnHeader} appProps={appProps} />);
}

function HeaderSortable(props: {columnHeader: ColumnHeader, appProps: AppProps}): JSX.Element {
	const {columnHeader, appProps} = props;
	const {sortColumns} = appProps.store.getState();

	// Column sort buton clicks
	function sortColumnClick(e: MouseEvent) {
		// Click sets primary, ctrl or shift click sets secondary
		// ctrl+shift click sets tertiary
		const position = (e.ctrlKey ? 1 : 0) + (e.shiftKey ? 1 : 0) as 0 | 1 | 2;

		appProps.store.dispatch(updateSortColumnsAction({
			name: columnHeader.name,
			label: columnHeader.label,
			position: position,
			defaultDirection: columnHeader.defaultSortDirection
		}));
		appProps.handleRender();
	};

	const classes = [columnHeader.name];
	let ariaSort = null;

	// Add classes/attributes so the UI reflects the sort state
	for (const [index, sortColumn] of sortColumns.entries()) {

		if (sortColumn.name === columnHeader.name) {
			const sortDirection = sortColumn.direction == 1 ? "ascending" : "descending";
			const sortLevels = ["primary", "secondary", "tertiary"];

			classes.push(sortDirection);
			classes.push(sortLevels[index]);

			// Set aria-sort if this is the primary sort column.
			// No aria support for multiple column sorting
			if (index === 0) {
				ariaSort = sortDirection;
			}
		}
	}

	return (
		<th
			// @ts-expect-error: tsx-dom incorrectly types draggable as boolean
			draggable="true"
			class={classes.join(" ")}
			data-sort-on={columnHeader.name}
			data-default-direction={columnHeader.defaultSortDirection}
			aria-sort={ariaSort}
			onClick={sortColumnClick}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<button class="strong" type="button">
				<div class="column">
					<span class="text">{columnHeader.label}</span>
				</div>
				<div class="column">
					<span class="sort up" aria-hidden="true">▲</span>
					<span class="sort down" aria-hidden="true">▼</span>
				</div>
			</button>
		</th>
	);
}

function HeaderNoSort(props: {columnHeader: ColumnHeader}): JSX.Element {
	return (
		<th class={`${props.columnHeader.name} no-sort strong`}>
			<span>{props.columnHeader.label}</span>
		</th>
	);
}

function TableRow(props: {rowData: ResultRow, appProps: AppProps}): JSX.Element {
	const COMPETITOR_BASE_URL = "https://www.worldcubeassociation.org/persons";
	const COMPETITION_BASE_URL = "https://www.worldcubeassociation.org/competitions";
	const RANKINGS_BASE_URL = "https://wca-seniors.org/Senior_Rankings.html";
	const {rowData, appProps} = props;
	const rankingType = appProps.store.getState().filters.rankingType;

	// Insert a wbr tag to declare that we can word-break after the "YYYY-" portion
	const dashIndex = rowData.date.indexOf("-");
	const dateYear = rowData.date.slice(0, dashIndex + 1);
	const dateMonthAndDay = rowData.date.slice(dashIndex + 1);

	const competitorURL = `${COMPETITOR_BASE_URL}/${rowData.wcaID}?event=${rowData.eventID}`;
	const competitionURL = `${COMPETITION_BASE_URL}/${rowData.compWebID}/results/by_person#${rowData.wcaID}`;
	const rankingURL = `${RANKINGS_BASE_URL}#${rowData.eventID}-${rowData.eventType}-${rowData.age}`;

	let groupLink: JSX.Element;
	switch (rankingType) {
		case "wr": {
			groupLink = (
				<a href={rankingURL} target="_blank">
					{rowData.age}+
				</a>
			);
			break;
		}

		case "cr": {
			groupLink = (
				<a href={rankingURL + `-${rowData.continent.id}`} target="_blank">
					{rowData.continent.id}&nbsp;{rowData.age}+
				</a>
			);
			break;
		}

		case "nr": {
			groupLink = (
				<a href={rankingURL + `-xx-${rowData.country.id}`} target="_blank">
					{rowData.country.id}&nbsp;{rowData.age}+
				</a>
			);
			break;
		}
	}

	return (
		<tr>
			<td class="date">{dateYear}<wbr />{dateMonthAndDay}</td>
			<td class="event">
				<i class={`event-${rowData.eventID} cubing-icon icon`} />
				{rowData.eventID} {rowData.eventType}
			</td>
			<td class="group">
				{groupLink}
			</td>
			<td class="rank">
				{rowData.rank}
			</td>
			<td class="name">
				<a href={competitorURL} target="_blank">
					<span class={`flag-${rowData.country.id} flag`} />&nbsp;{rowData.name}
				</a>
			</td>
			<td class="result">{rowData.result}</td>
			<td class="competition">
				<a href={competitionURL} target="_blank">
					<span class={`flag-${rowData.compCountry} flag`}></span>&nbsp;
					{rowData.compName}
				</a>
			</td>
		</tr>
	);
}

function NoResults(): JSX.Element {
	return (
		<h3 class="no-results">No results</h3>
	);
}

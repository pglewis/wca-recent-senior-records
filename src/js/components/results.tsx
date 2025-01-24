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
	{
		name: "date",
		label: "Date",
		defaultSortDirection: -1,
	},
	{
		name: "event",
		label: "Event",
		defaultSortDirection: 1,
	},
	{
		name: "group",
		label: "Group",
		defaultSortDirection: 1,
	},
	{
		name: "rank",
		label: "Rank",
		defaultSortDirection: 1,
	},
	{
		name: "name",
		label: "Name",
		defaultSortDirection: 1,
	},
	{
		name: "result",
		label: "Result",
		defaultSortDirection: 1,
	},
	{
		name: "competition",
		label: "Competition",
		defaultSortDirection: null,
	}
];

export function Results(props: AppProps): JSX.Element {
	const {results} = props.store.getState();

	if (!results || results.length === 0) {
		return NoResults();
	}

	return ResultsTable(props);
}

function ResultsTable(props: AppProps): JSX.Element {
	const results = props.store.getState().results;

	return (
		<table id="ranking-table" class="rankings sortable">
			<thead>
				<TableHeaderRow headers={headers} appProps={props} />
			</thead>
			<tbody>
				{results.map(ResultsTableRow)}
			</tbody>
		</table>
	);
}

function TableHeaderRow(props: {headers: ColumnHeader[], appProps: AppProps}): JSX.Element {
	const {headers, appProps} = props;
	const theHeaders: JSX.Element[] = [];

	for (const thisHeader of headers) {
		theHeaders.push(<TableHeader header={thisHeader} appProps={appProps} />);
	}

	return (
		<tr>
			{theHeaders}
		</tr>
	);
}

function TableHeader(props: {header: ColumnHeader, appProps: AppProps}): JSX.Element {
	const {header, appProps} = props;
	const {sortColumns} = appProps.store.getState();

	if (!header.defaultSortDirection) {
		return HeaderNoSort(header);
	}

	const classes = [header.name];
	let ariaSort = null;

	// Add classes/attributes so the UI reflects the sort state
	for (const [index, sortColumn] of sortColumns.entries()) {
		const sortDirection = sortColumn.direction == 1 ? "ascending" : "descending";

		if (sortColumn.name === header.name) {
			const sortLevels = ["primary", "secondary", "tertiary"];

			// Set aria-sort if this is the primary sort column.
			// No aria support for multiple column sorting
			if (index === 0) {
				ariaSort = sortDirection;
			}

			classes.push(sortDirection);
			classes.push(sortLevels[index]);
		}
	}

	// Column sort buton clicks
	function sortColumnClick(e: MouseEvent) {
		// Click sets primary, ctrl or shift click sets secondary
		// ctrl+shift click sets tertiary
		const position = (e.ctrlKey ? 1 : 0) + (e.shiftKey ? 1 : 0) as 0 | 1 | 2;

		appProps.store.dispatch(updateSortColumnsAction({
			name: header.name,
			label: header.label,
			position: position,
			defaultDirection: header.defaultSortDirection
		}));
		appProps.handleRender();
	};

	const thProps = {
		class: classes.join(" "),
		draggable: "true",
		"data-sort-on": header.name,
		"data-default-direction": header.defaultSortDirection === 1 ? null : header.defaultSortDirection,
		"aria-sort": ariaSort,
		onClick: sortColumnClick,
		onDragStart: handleDragStart,
		onDragEnd: handleDragEnd,
	};

	return (
		// @ts-expect-error: draggable is incorrectly typed as boolean
		<th {...thProps} >
			<button class="strong" type="button">
				<div class="column">
					<span class="text">{header.label}</span>
				</div>
				<div class="column">
					<span class="sort up" aria-hidden="true">▲</span>
					<span class="sort down" aria-hidden="true">▼</span>
				</div>
			</button>
		</th>
	);
}

function HeaderNoSort(header: ColumnHeader): JSX.Element {
	return (
		<th class={`${header.name} no-sort strong`}>
			<span>{header.label}</span>
		</th>
	);
}

function ResultsTableRow(rowData: ResultRow): JSX.Element {
	const COMPETITOR_BASE_URL = "https://www.worldcubeassociation.org/persons";
	const COMPETITION_BASE_URL = "https://www.worldcubeassociation.org/competitions";
	const RANKINGS_BASE_URL = "https://wca-seniors.org/Senior_Rankings.html";

	// Insert a wbr tag to declare that we can word-break after the "YYYY-" portion
	const dashIndex = rowData.date.indexOf("-");
	const dateYear = rowData.date.slice(0, dashIndex + 1);
	const dateMonthAndDay = rowData.date.slice(dashIndex + 1);

	// Age group
	const rankingLink = `${RANKINGS_BASE_URL}#${rowData.eventID}-${rowData.eventType}-${rowData.age}`;
	const competitorLink = `${COMPETITOR_BASE_URL}/${rowData.wcaID}?event=${rowData.eventID}`;
	const competitionLink = `${COMPETITION_BASE_URL}/${rowData.compWebID}/results/by_person#${rowData.wcaID}`;

	return (
		<tr>
			<td class="date">{dateYear}<wbr />{dateMonthAndDay}</td>
			<td class="event">
				<i class={`event-${rowData.eventID} cubing-icon icon`} />
				{rowData.eventID} {rowData.eventType}
			</td>
			<td class="age">
				<a href={rankingLink} target="_blank">{rowData.age}+</a>
			</td>
			<td class="rank">{rowData.rank}</td>
			<td class="name">
				<a href={competitorLink} target="_blank">{rowData.name}</a>
			</td>
			<td class="result">{rowData.result}</td>
			<td class="competition">
				<i class={`flag-${rowData.compCountry} flag`} />
				&nbsp;<a href={competitionLink} target="_blank">{rowData.compName}</a>
			</td>
		</tr>
	);
}

function NoResults(): JSX.Element {
	return (
		<h3 class="no-results">No results</h3>
	);
}

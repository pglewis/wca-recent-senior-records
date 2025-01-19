import type {ResultRow} from "../app-state/app-state";
import {updateSortColumnsAction} from "../app-state/sort-columns-reducer";
import {AppProps} from "./app";
import {getTemplateElement} from "./get-template-element";
import {getTemplatePart} from "./get-template-part";
import {handleDragStart, handleDragEnd} from "./sort-column-list";

export function Results(props: AppProps): HTMLElement {
	const {results} = props.store.getState();

	if (!results || results.length === 0) {
		return NoResults();
	}

	return ResultsTable(props);
}

function ResultsTable(props: AppProps): HTMLElement {
	const {store, handleRender} = props;
	const {results} = store.getState();
	const resultsTable = getTemplateElement("#ranking-table-template");
	const tbody = resultsTable.querySelector("tbody") as HTMLElement;

	tbody.append(...results.map(ResultsTableRow));

	// Listen to column click events on sortable columns
	const tHeaders = resultsTable.querySelectorAll<HTMLElement>("thead th");

	for (const colHeader of tHeaders) {
		const buttonNode = colHeader.querySelector("button");

		// Only the sortable columns have a sort button
		if (buttonNode) {
			const {sortColumns} = store.getState();
			const columnName = String(colHeader.dataset.sortOn);
			const columnLabel = String(buttonNode.textContent);
			const sortLevels = {0: "primary", 1: "secondary", 2: "tertiary"};

			// Add classes/attributes so the UI reflects the sort state
			for (const [index, sortColumn] of sortColumns.entries()) {
				const sortDirection = sortColumn.direction == 1 ? "ascending" : "descending";

				if (sortColumn.name === columnName) {
					// Set aria-sort if this is the primary sort column.
					// No aria support for multiple column sorting
					if (index === 0) {
						colHeader.setAttribute("aria-sort", sortDirection);
					}

					colHeader.classList.add(sortDirection);
					colHeader.classList.add(sortLevels[index as 0 | 1 | 2]);
				}
			}

			// Allow dragging to the sort column list
			colHeader.addEventListener("dragstart", handleDragStart);
			colHeader.addEventListener("dragend", handleDragEnd);

			// Column sort buton clicks
			buttonNode.addEventListener("click", (e) => {
				// Click sets primary, ctrl or shift click sets secondary
				// ctrl+shift click sets tertiary
				const position = (e.ctrlKey ? 1 : 0) + (e.shiftKey ? 1 : 0) as 0 | 1 | 2;
				const defaultDirection = Number(colHeader.dataset.defaultDirection) || 1;

				store.dispatch(updateSortColumnsAction({
					name: columnName,
					label: columnLabel,
					position: position,
					defaultDirection: defaultDirection as 1 | -1
				}));
				handleRender();
			});
		}
	}

	return resultsTable;
}

function ResultsTableRow(rowData: ResultRow): HTMLElement {
	const COMPETITOR_BASE_URL = "https://www.worldcubeassociation.org/persons";
	const COMPETITION_BASE_URL = "https://www.worldcubeassociation.org/competitions";
	const RANKINGS_BASE_URL = "https://wca-seniors.org/Senior_Rankings.html";

	// New table row cloned from the template
	const tableRow = getTemplateElement("#result-row-template");

	// Date
	const date = getTemplatePart(tableRow, "td.date", HTMLElement);

	// Declare that we can word-break after the "YYYY-" portion
	const dashIndex = rowData.date.indexOf("-");
	date.innerHTML =
		rowData.date.slice(0, dashIndex + 1)
		+ "<wbr>"
		+ rowData.date.slice(dashIndex + 1);

	// Event
	const eventCell = getTemplatePart(tableRow, "td.event");
	const eventIcon = getTemplatePart(eventCell, "i.icon");
	eventIcon.classList.add(`event-${rowData.eventID}`);
	eventCell.append(`${rowData.eventID} ${rowData.eventType}`);

	// Age group
	const rankingLink = getTemplatePart(tableRow, "td.age a", HTMLAnchorElement);
	rankingLink.textContent = `${rowData.age}+`;
	rankingLink.href = `${RANKINGS_BASE_URL}#${rowData.eventID}-${rowData.eventType}-${rowData.age}`;

	// Rank
	const rank = getTemplatePart(tableRow, "td.rank");
	rank.textContent = String(rowData.rank);

	// Competitor
	const competitorLink = getTemplatePart(tableRow, "td.name a", HTMLAnchorElement);
	competitorLink.textContent = rowData.name;
	competitorLink.href = `${COMPETITOR_BASE_URL}/${rowData.wcaID}?event=${rowData.eventID}`;

	// Result
	const theResult = getTemplatePart(tableRow, "td.result");
	theResult.textContent = rowData.result;

	// Competition
	const competitionLink = getTemplatePart(tableRow, "td.competition a", HTMLAnchorElement);
	competitionLink.textContent = rowData.compName;
	competitionLink.href = `${COMPETITION_BASE_URL}/${rowData.compWebID}/results/by_person#${rowData.wcaID}`;

	const competitionFlag = getTemplatePart(tableRow, "td.competition i.flag");
	competitionFlag.classList.add(`flag-${rowData.compCountry}`);

	return tableRow;
}

function NoResults(): HTMLElement {
	return getTemplateElement("#no-results-template");
}

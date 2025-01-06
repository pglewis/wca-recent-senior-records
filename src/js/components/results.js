// @ts-check

/**
 * @typedef {import("../state/state").ResultRowData} ResultRowData
 * @typedef {import("./app").AppProps} AppProps
 */
import {getTemplateElement} from "./get-template-element.js";
import {getTemplatePart} from "./get-template-part.js";
import {updateSortColumnsAction} from "../state/sort-columns-reducer.js";
import {handleDragStart, handleDragEnd} from "./sort-column-list.js";

/** @type {import("./results").Results} */
export function Results(props) {
	const {results} = props.store.getState();

	if (!results || results.length === 0) {
		return NoResults();
	}

	return ResultsTable(props);
}

/**
 * @param   {AppProps}    props
 * @returns {HTMLElement}
 */
function ResultsTable(props) {
	const {store, handleRender} = props;
	const {results} = store.getState();
	const resultsTable = getTemplateElement("#ranking-table-template");
	const tbody =
		/**@type {HTMLElement}*/(resultsTable.querySelector("tbody"));

	tbody.append(...results.map(ResultsTableRow));

	// Listen to column click events on sortable columns
	const tHeaders =
		/**@type {NodeListOf<HTMLElement>}*/(resultsTable.querySelectorAll("thead th"));

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
					colHeader.classList.add(sortLevels[index]);
				}
			}

			// Allow dragging to the sort column list
			colHeader.addEventListener("dragstart", handleDragStart);
			colHeader.addEventListener("dragend", handleDragEnd);

			// Column sort buton clicks
			buttonNode.addEventListener("click", (e) => {
				// Click sets primary, ctrl or shift click sets secondary
				// ctrl+shift click sets tertiary
				const position =
					/**@type {0 | 1 | 2}*/ ((e.ctrlKey ? 1 : 0) + (e.shiftKey ? 1 : 0));
				const defaultDirection = Number(colHeader.dataset.defaultDirection) || 1;

				store.dispatch(updateSortColumnsAction({
					name: columnName,
					label: columnLabel,
					position: position,
					defaultDirection: /**@type {1 | -1}*/(defaultDirection)
				}));
				handleRender();
			});
		}
	}

	return resultsTable;
}

/**
 * @param   {ResultRowData} rowData
 * @returns {HTMLElement}
 */
function ResultsTableRow(rowData) {
	const COMPETITOR_BASE_URL = "https://www.worldcubeassociation.org/persons";
	const COMPETITION_BASE_URL = "https://www.worldcubeassociation.org/competitions";
	const RANKINGS_BASE_URL = "https://wca-seniors.org/Senior_Rankings.html";

	// New table row cloned from the template
	const tableRow = getTemplateElement("#result-row-template");

	// Date
	const date = getTemplatePart(tableRow, "td.date", HTMLElement);
	date.textContent = rowData.date;

	// Event
	const eventCell = getTemplatePart(tableRow, "td.event", HTMLElement);
	const eventIcon = getTemplatePart(eventCell, "i.icon", HTMLElement);
	eventIcon.classList.add(`event-${rowData.eventID}`);
	eventCell.append(`${rowData.eventID} ${rowData.eventType}`);

	// Age group
	const rankingLink = getTemplatePart(tableRow, "td.age a", HTMLAnchorElement);
	rankingLink.textContent = `${rowData.age}+`;
	rankingLink.href = `${RANKINGS_BASE_URL}#${rowData.eventID}-${rowData.eventType}-${rowData.age}`;

	// Rank
	const rank = getTemplatePart(tableRow, "td.rank", HTMLElement);
	rank.textContent = String(rowData.rank);

	// Competitor
	const competitorLink = getTemplatePart(tableRow, "td.name a", HTMLAnchorElement);
	competitorLink.textContent = rowData.name;
	competitorLink.href = `${COMPETITOR_BASE_URL}/${rowData.wcaID}?event=${rowData.eventID}`;

	// Result
	const theResult = getTemplatePart(tableRow, "td.result", HTMLElement);
	theResult.textContent = rowData.result;

	// Competition
	const competitionLink = getTemplatePart(tableRow, "td.competition a", HTMLAnchorElement);
	competitionLink.textContent = rowData.compName;
	competitionLink.href = `${COMPETITION_BASE_URL}/${rowData.compWebID}/results/by_person#${rowData.wcaID}`;

	const competitionFlag = getTemplatePart(tableRow, "td.competition i.flag", HTMLElement);
	competitionFlag.classList.add(`flag-${rowData.compCountry}`);

	return tableRow;
}

/**
 * @returns {HTMLElement}
 */
function NoResults() {
	return getTemplateElement("#no-results-template");
}

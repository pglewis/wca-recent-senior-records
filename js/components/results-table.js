import { updateSortFieldsAction, sortResultsAction } from "../state/state.js";
import { handleDragStart, handleDragEnd } from "./sort-column-list.js";
import { getTemplateElement } from "./get-template-element.js";

/**
 * @param {Object}    props
 * @param {DataStore} props.store
 * @param {Function}  props.handleRender
 *
 * @returns {HTMLTableElement}
 */
export function ResultsTable(props) {
	const { store, handleRender } = props;
	const { results } = store.getState();
	const resultTable = getTemplateElement("#ranking-table-template");
	const tbody = resultTable.querySelector("tbody");

	tbody.append(...results.map(ResultsTableRow));

	// Listen to column click events on sortable columns
	for (const colHeader of resultTable.querySelectorAll("thead th")) {
		const buttonNode = colHeader.querySelector("button");

		// Only the sortable columns have a sort button
		if (buttonNode) {
			const { sortColumns } = store.getState();
			const columnName = colHeader.dataset.sortOn;
			const columnLabel = buttonNode.textContent;
			const sortLevels = { 0: "primary", 1: "secondary", 2: "tertiary" };

			// Add classes/attributes so the UI reflects the sort state
			for (const [index, sortColumn] of sortColumns.entries()) {
				const sortDirection = sortColumn.direction == 1 ? "ascending" : "descending";

				if (sortColumn.name === columnName) {
					// Set aria-sort if this is the primary sort column.
					// No aria support for multiple column sorting, sadly
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
				const position = (e.ctrlKey ? 1 : 0) + (e.shiftKey ? 1 : 0);
				const defaultDirection = colHeader.dataset.defaultDirection || 1;

				store.dispatch(updateSortFieldsAction({
					name: columnName,
					label: columnLabel,
					position: position,
					defaultDirection: defaultDirection
				}));
				store.dispatch(sortResultsAction());
				handleRender();
			});
		}
	}

	return resultTable;
}

/**
 *
 * @param {ResultRowData} rowData
 *
 * @returns {HTMLElement}
 */
function ResultsTableRow(rowData) {
	const COMPETITOR_BASE_URL = "https://www.worldcubeassociation.org/persons";
	const COMPETITION_BASE_URL = "https://www.worldcubeassociation.org/competitions";
	const RANKINGS_BASE_URL = "https://wca-seniors.org/Senior_Rankings.html";

	// New table row cloned from the template
	const tableRow = getTemplateElement("#result-row-template");

	// Date
	tableRow.querySelector("td.date").textContent = rowData.date;

	// Event
	const eventCell = tableRow.querySelector("td.event");
	eventCell.querySelector("i.icon").classList.add(`event-${rowData.eventID}`);
	eventCell.append(`${rowData.eventID} ${rowData.eventType}`);

	// Age group
	let rankingLink = tableRow.querySelector("td.age a");
	rankingLink.textContent = `${rowData.age}+`;
	rankingLink.href = `${RANKINGS_BASE_URL}#${rowData.eventID}-${rowData.eventType}-${rowData.age}`;

	// Rank
	tableRow.querySelector("td.rank").textContent = rowData.rank;

	// Competitor
	let competitorLink = tableRow.querySelector("td.name a");
	competitorLink.textContent = rowData.name;
	competitorLink.href = `${COMPETITOR_BASE_URL}/${rowData.wcaID}?event=${rowData.eventID}`;

	// Result
	const theResult = tableRow.querySelector("td.result");
	theResult.textContent = rowData.result;

	// Competition
	let competitionLink = tableRow.querySelector("td.competition a");
	competitionLink.textContent = rowData.compName;
	competitionLink.href = `${COMPETITION_BASE_URL}/${rowData.compWebID}/results/by_person#${rowData.wcaID}`;
	tableRow.querySelector("td.competition i.flag").classList.add(`flag-${rowData.compCountry}`);

	return tableRow;
}

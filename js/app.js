import {
	setTopNAction,
	setRecentInDaysAction,
	sortResultsAction,
	setSortPropAction,
	setSortAscendingAction,
	toggleSortDirectionAction,
	clearResultsAction,
} from "./state.js";

/**
 * @param {string} selectors
 *
 * @returns {Root}
 */
export function createRoot(selectors) {
	const root = document.querySelector(selectors);

	function render(node) {
		root.replaceChildren(node);
	}

	return {
		render: render,
	};
}

/**
 * @param {Object}     props
 * @param {DataStore}  props.store
 * @param {Function}   props.handleRender  Callback to re-render
 *
 * @returns {HTMLElement}
 */
export function App(props) {
	const container = document.createElement("div");

	container.appendChild(ParameterPanel(props));
	container.appendChild(Results(props));

	return container;
}

/**
 * @param {Object}    props
 * @param {DataStore} props.store
 * @param {Function}  props.handleRender
 *
 * @returns {HTMLElement}
 */
function ParameterPanel(props) {
	const { store, handleRender } = props || {};
	const { recentInDays, topN } = store.getState();

	const parameterPanel = getTemplateElement("#parameters");

	/** Recent in days select box @type {HTMLSelectElement} */
	const recentSelect = parameterPanel.querySelector("#recent-in-days");
	recentSelect.value = recentInDays;
	recentSelect.addEventListener("change", (e) => {
		store.dispatch(setRecentInDaysAction(+e.currentTarget.value));
		store.dispatch(clearResultsAction());
		handleRender();
	});

	/** Top N select box @type {HTMLSelectElement} */
	const topNSelect = parameterPanel.querySelector("#top-n");
	topNSelect.value = topN;
	topNSelect.addEventListener("change", (e) => {
		store.dispatch(setTopNAction(+e.currentTarget.value));
		store.dispatch(clearResultsAction());
		handleRender();
	});

	return parameterPanel;
}

/**
 * @param {Object}    props
 * @param {DataStore} props.store
 *
 * @returns {HTMLElement}
 */
function Results(props) {
	const { store } = props;
	const {
		results,
		dataLastUpdated,
		topN,
		recentInDays
	} = store.getState();

	const resultsContainer = getTemplateElement("#results");
	const info = resultsContainer.querySelector(".result-info");
	const refreshed = resultsContainer.querySelector(".refreshed");

	info.textContent = `Showing ${results.length} results in the top ${topN} set in the past ${recentInDays} day(s)`;
	refreshed.textContent = `Last refreshed: ${dataLastUpdated} (UTC)`;

	if (results.length === 0) {
		resultsContainer.appendChild(NoResults());
	} else {
		resultsContainer.appendChild(ResultsTable(props));
	}

	return resultsContainer;
}

/**
 * @param {Object}        props
 * @param {DataStore}     props.store
 * @param {Function}      props.handleRender
 *
 * @returns {HTMLTableElement}
 */
function ResultsTable(props) {
	const { store, handleRender } = props;
	const { results } = store.getState();
	const resultTable = getTemplateElement("#event-ranking-table");
	const tbody = resultTable.querySelector("tbody");

	tbody.append(...results.map(ResultsTableRow));

	// Listen to column click events on sortable columns
	for (const colHeader of resultTable.querySelectorAll("thead th")) {
		const buttonNode = colHeader.querySelector("button");

		// Only the sortable columns have a sort button
		if (buttonNode) {
			const {sortProp, sortDirection} = store.getState();

			// Set aria-sort if this is the sort column
			if (colHeader.dataset.sortProp === sortProp) {
				if (sortDirection === 1) {
					colHeader.setAttribute("aria-sort", "ascending");
				} else {
					colHeader.setAttribute("aria-sort", "descending");
				}
			}

			/**
			 * Set the property to sort on, set the sort direction,
			 * sort the results, and notify via the callback
			 */
			buttonNode.addEventListener("click", () => {
				const newSortProp = colHeader.dataset.sortProp;
				const oldSortProp = store.getState().sortProp;

				store.dispatch(setSortPropAction(newSortProp));

				// Toggle sort direction if this was already the sort col
				if ( newSortProp === oldSortProp ) {
					store.dispatch(toggleSortDirectionAction());
				} else {
					// otherwise default to Asc
					store.dispatch(setSortAscendingAction());
				}

				store.dispatch(sortResultsAction(newSortProp));
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
	let tableRow = getTemplateElement("#result-row");

	// Date
	tableRow.querySelector("td.date").textContent = rowData.date;

	// Event
	const eventCell = tableRow.querySelector("td.event");
	eventCell.querySelector("i.icon").classList.add(`event-${rowData.eventID}`);
	eventCell.append(`${rowData.eventID} ${rowData.eventType}`);

	// Age group
	let rankingLink = tableRow.querySelector("td.age-group a");
	rankingLink.textContent = `${rowData.age}+`;
	rankingLink.href = `${RANKINGS_BASE_URL}#${rowData.eventID}-${rowData.eventType}-${rowData.age}`;

	// Rank
	tableRow.querySelector("td.rank").textContent = rowData.rank;

	// Competitor
	let competitorLink = tableRow.querySelector("td.person a")
	competitorLink.textContent = rowData.name;
	competitorLink.href = `${COMPETITOR_BASE_URL}/${rowData.wcaID}?event=${rowData.eventID}`;

	// Result
	const theResult = tableRow.querySelector("td.result");
	theResult.textContent = rowData.result;
	theResult.setAttribute("data-format", rowData.eventFormat);

	// Competition
	let competitionLink = tableRow.querySelector("td.competition a");
	competitionLink.textContent = rowData.compName;
	competitionLink.href = `${COMPETITION_BASE_URL}/${rowData.compWebID}/results/by_person#${rowData.wcaID}`;
	tableRow.querySelector("td.competition i.flag").classList.add(`flag-${rowData.compCountry}`);

	return tableRow;
}

/**
 * @returns {HTMLElement}
 */
function NoResults() {
	return getTemplateElement("#no-results");
}

/**
 * @returns {HTMLElement}
 */
export function Loading() {
	return getTemplateElement("#loading");
}

/**
 * @param {string} message
 *
 * @returns {HTMLElement}
 */
export function ErrorMessage(message) {
	const errorMessage = getTemplateElement("#error");

	const messageNode = errorMessage.querySelector(".message");
	messageNode.classList.add("important");
	messageNode.textContent = message;

	return errorMessage;
}

/**
 * Helper function. Requires a single, root HTMLElement inside the template
 *
 * Finds the first template element in the document that matches the
 * specified group of selectors, clones its content, and returns the
 * root HTMLElement inside DocumentFragment.
 *
 * @param {string} selectors
 *
 * @returns {HTMLElement}
 */
function getTemplateElement(selectors) {
	const template = document.querySelector(`template${selectors}`);

	if (!template) {
		// Check typical selector mistakes: typo, missing # or .
		throw `Unable to find "${selectors}" in getTemplateElement()`;
	}

	// Clone the template content and grab the first
	// HTMLElement from the DocumentFragment
	const element = template.content.cloneNode(true).firstElementChild;

	return element;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";

interface PaginationProps {
	currentPage: number,
	totalPages: number,
	onPageChange: (page: number) => void;
};

export function Pagination(props: PaginationProps) {
	const {currentPage, totalPages, onPageChange} = props;

	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	const handleInputChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const pageNumber = parseInt(target.value, 10);
		if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
			onPageChange(pageNumber);
		}
	};

	// Determine start and end page buttons
	const maxButtons = 5;
	let startPage = 1;
	let endPage = totalPages;

	if (totalPages > maxButtons) {
		if (currentPage <= 3) {
			// Near start
			startPage = 1;
			endPage = 5;
		} else if (currentPage >= totalPages - 2) {
			// Near end
			startPage = totalPages - 4;
			endPage = totalPages;
		} else {
			// Middle
			startPage = currentPage - 2;
			endPage = currentPage + 2;
		}
	}

	// Generate page buttons
	const pageButtons = [];
	for (let page = startPage; page <= endPage; page++) {
		const buttonClass = page === currentPage ? "page-button page-button-active" : "page-button";
		pageButtons.push(
			<button class={buttonClass} onClick={() => onPageChange(page)}>{page}</button>
		);
	}

	return (
		<div class="page-selector-box">
			<button class="page-button previous" onClick={handlePrevious} disabled={currentPage === 1}>◀</button>
			{pageButtons}
			<button class="page-button next" onClick={handleNext} disabled={currentPage === totalPages}>▶</button>
			<span style="margin-left: .5em;">
				page
				&nbsp;
				<input type="number" min={1} max={totalPages} value={currentPage} onChange={handleInputChange} />
				&nbsp;
				of {totalPages}
			</span>
		</div>
	);
}

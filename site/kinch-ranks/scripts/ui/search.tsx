// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {debounce} from "@repo/lib/util/debounce";
import {KinchRank} from "@repo/lib/types/kinch-types";
import {Person} from "@repo/lib/types/rankings-snapshot";

interface SearchProps {
	searchTerm: string;
	kinchRanks: KinchRank[];
	onChange: (searchTerm: string) => void;
	onSelect: (result: Person["id"]) => void;
}

export function Search(props: SearchProps): JSX.Element {
	const {
		searchTerm,
		kinchRanks,
		onChange,
		onSelect,
	} = props;

	// State for dropdown visibility
	let showDropdown = false;

	// Filtered results based on searchTerm
	let filteredResults: KinchRank[] = [];

	// Helper to determine if dropdown should be shown
	if (searchTerm && searchTerm.length > 2) {
		const lowerTerm = searchTerm.toLowerCase();
		filteredResults = kinchRanks.filter(kr =>
			kr.personID.toLowerCase().includes(lowerTerm)
			|| kr.personName.toLowerCase().includes(lowerTerm)
		).slice(0, 10); // Limit to X results
		showDropdown = filteredResults.length > 0;
	}

	function handleInput(e: Event) {
		const inputElement = e.target as HTMLInputElement;
		onChange(inputElement.value);
	}

	function handleSelect(result: KinchRank) {
		onSelect(result.personID);
	}

	return (
		<div id="search" style="position: relative;">
			<input
				id="search-input"
				value={searchTerm}
				onInput={debounce(handleInput, 350)}
				type="search"
				size={23}
				placeholder="Search name or WCA ID"
				autocomplete="off"
				// @ts-expect-error: TSX DOM mistakenly has this as boolean
				spellcheck="false"
			/>
			{showDropdown && (
				<ul id="search-results">
					{filteredResults.map(result => (
						<li onClick={() => handleSelect(result)}>
							{result.personName} ({result.personID})
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

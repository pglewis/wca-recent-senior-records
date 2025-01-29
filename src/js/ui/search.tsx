// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {setSearchFilterAction} from "../app-state/filters-reducer";
import {debounce} from "../util/debounce";

function getPlaceholder() {
	const placeholders = [
		"333bf",
		"333 60",
		"sq1 eu",
		"555 au 40",
		"50",
		"skewb single na 50",
		"clock average",
		"333fm average",
		"competitor name",
		"competition name",
	];

	return "e.g. " + placeholders[Math.floor(Math.random() * placeholders.length)];
}

export function Search(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {search} = store.getState().filters;

	function handleInput(e: Event) {
		const inputElement = e.target as HTMLInputElement;
		store.dispatch(setSearchFilterAction(inputElement.value));
		handleRender();
	}

	return (
		<div id="search">
			<label class="strong">
				Search:&nbsp;
				<input
					value={search}
					onInput={debounce(handleInput, 350)}
					id="search-input"
					type="search"
					size={20}
					placeholder={getPlaceholder()}
				/>
			</label>
		</div>
	);
}

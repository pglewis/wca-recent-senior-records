// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {setSearchFilterAction} from "../app-state/filters-reducer";
import {debounce} from "../util/debounce";

function getPlaceholder() {
	const placeholders = [
		"40, 50, 60, etc.",
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
					size={25}
					placeholder={getPlaceholder()}
				/>
			</label>
		</div>
	);
}

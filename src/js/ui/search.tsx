// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {setSearchFilterAction} from "../app-state/filters-reducer";
import {debounce} from "../util/debounce";

const placeHolders = [
	"333bf",
	"333 60",
	"sq1 eu",
	"555 au 40",
	"60",
	"minx average",
];

export function Search(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {search} = store.getState().filters;
	const placeHolder = "e.g. " + placeHolders[Math.floor(Math.random() * placeHolders.length)];

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
					onInput={debounce(handleInput, 500)}
					id="search-input"
					type="search"
					size={20}
					placeholder={placeHolder}
				/>
			</label>
		</div>
	);
}

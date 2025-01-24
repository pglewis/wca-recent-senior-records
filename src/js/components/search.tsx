// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
import {AppProps} from "../app-state/app-state";
import {setSearchFilterAction} from "../app-state/filters-reducer";

export function Search(props: AppProps): JSX.Element {
	const {store, handleRender} = props;
	const {search} = store.getState().filters;
	const placeHolder = "e.g. 333bf";

	function handleInput(e: Event) {
		const inputElement = e.currentTarget as HTMLInputElement;
		store.dispatch(setSearchFilterAction(inputElement.value));
		handleRender();
	}

	//--!! Duct tape
	function handleFocus(this: HTMLInputElement) {
		const textLen = this.value.length;
		this.setSelectionRange(textLen, textLen);
	}

	return (
		<div id="search">
			<label class="strong">
				Search:&nbsp;
				<input
					value={search}
					onInput={handleInput}
					onFocus={handleFocus}
					id="search-input"
					type="search"
					size={15}
					placeholder={placeHolder}
				/>
			</label>
		</div>
	);
}

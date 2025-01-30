// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";

export interface SelectOption {
	value: string
	label: string
}

export function SelectOptions(options: SelectOption[], selected: string | number): JSX.Element[] {
	return options.map(option =>
		<option value={option.value} selected={option.value == selected}>{option.label}</option>
	);
}

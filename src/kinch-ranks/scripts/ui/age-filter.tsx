// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
interface AgeFilterProps {
	age: number,
	ageList: number[],
	onAgeChange: (age: number) => void;
}

export function AgeFilter(props: AgeFilterProps) {
	const {age, ageList, onAgeChange} = props;

	function handleEventFilterChange(this: HTMLSelectElement) {
		onAgeChange(Number(this.value));
	}

	return (
		<div class="age-filter">
			<select id="age-filter" onChange={handleEventFilterChange} value={age}>
				{ageList.map(ageItem =>
					(<option value={ageItem} selected={age === ageItem}>Over {ageItem}</option>)
				)}
			</select>
		</div>
	);
}

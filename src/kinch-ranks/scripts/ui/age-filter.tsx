// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";
interface AgeFilterProps {
	age: number,
	onAgeChange: (age: number) => void;
}

export function AgeFilter(props:AgeFilterProps) {
	const {age, onAgeChange} = props;

	function handleEventFilterChange(this: HTMLSelectElement) {
		onAgeChange(Number(this.value));
	}

	return (
		<div class="age-filter">
			<select id="age-filter" onChange={handleEventFilterChange} value={age}>
				<option value={40} selected={age === 40}>Over 40</option>
				<option value={50} selected={age === 50}>Over 50</option>
				<option value={60} selected={age === 60}>Over 60</option>
				<option value={70} selected={age === 70}>Over 70</option>
				<option value={80} selected={age === 80}>Over 80</option>
				<option value={90} selected={age === 90}>Over 90</option>
			</select>
		</div>
	);
}

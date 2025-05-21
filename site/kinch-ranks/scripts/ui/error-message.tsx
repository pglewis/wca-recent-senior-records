// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";

export function ErrorMessage(message: string) {
	return (
		<div class="error">
			<h3>Something went wrong &trade;</h3>
			<div class="message">{message}</div>
		</div>
	);
}

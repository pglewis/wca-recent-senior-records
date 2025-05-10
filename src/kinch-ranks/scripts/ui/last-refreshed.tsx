// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {h} from "tsx-dom";

export function LastRefreshed(props: {lastRefreshed: string}) {
	return (
		<div class="last-refreshed" >
			{`Data last refreshed: ${props.lastRefreshed} UTC`}
		</div >
	);
}

/**
 * Logs a statement to the Max console
 * @param messages Arbitrary number of message tokens to be logged
 */
export default function log(...messages: any[]) {
	for (const msg of messages) {
		if (msg === undefined) {
			continue;
		}

		if (msg instanceof Date) {
			post(msg.toString());
		}
		else if (typeof msg === "object") {
			post(JSON.stringify(msg));
		} else if (typeof msg === "string"){
			post(msg);
		} else {
			post(msg.toString());
		}
	}
	post("\n");
}


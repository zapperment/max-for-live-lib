import { log, observe } from "../../util";

autowatch = 1;

let observer = 0;

export function bang() {
  const message = `Observer ${observer++}`;
  observe("live_set is_playing", () => log(message));
}

import { log } from "../../util";

export const autowatch = 1;
export const inlets = 2;
export const outlets = 1;

export function bang() {
  log("let's bang!");
}

export function test(value: string) {
  log("test", value);
}

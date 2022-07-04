import Replass from "./Replass";

let replass: Replass;

export function bang() {
  if (!replass) {
    replass = new Replass();
  }
}

import Replass from "./Replass";

//max.preempt(1);

outlets = 4;

setinletassist(0, "Bang when device is initialized");
setoutletassist(0, "Bang when clip starts playing");
setoutletassist(1, "Bang when clip stops playing");
setoutletassist(2, "Number: the track index");
setoutletassist(3, "Status text of the device");

let replass: Replass;

export function bang() {
  if (!replass) {
    replass = new Replass();
  }
}

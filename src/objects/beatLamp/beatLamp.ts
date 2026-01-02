import { BeatLampManager } from "./BeatLampManager";

autowatch = 1;
inlets = 1;
outlets = 1;

setoutletassist(0, "Number: 0 is no slot is playing, otherwise 1");

const beatLampMan = new BeatLampManager();

export function start() {
  beatLampMan.start();
}

export function stop() {
  beatLampMan.stop();
}

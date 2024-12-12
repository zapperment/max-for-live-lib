import { BeatLampManager } from "./BeatLampManager";

autowatch = 1;
inlets = 1;
outlets = 0;

const beatLampMan = new BeatLampManager();

export function start() {
  beatLampMan.start();
}

export function stop() {
  beatLampMan.stop();
}

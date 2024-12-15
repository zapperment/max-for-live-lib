import { BeatLampManager } from "./BeatLampManager";

autowatch = 1;
inlets = 1;
outlets = 1;

setinletassist(0, "'start' or 'stop' to turn beat lamps on or off");
setoutletassist(0, "list: MIDI control change message");

const beatLampMan = new BeatLampManager(outlet);

export function start() {
  beatLampMan.start();
}

export function stop() {
  beatLampMan.stop();
}

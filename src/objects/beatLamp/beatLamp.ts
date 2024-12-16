import { BeatLampManager } from "./BeatLampManager";

autowatch = 0;
inlets = 1;
outlets = 1;

setinletassist(0, "bang: start beat lamps; 'stop': stop beat lamps");
setoutletassist(0, "list: MIDI control change message, connect to midiout");

const beatLampMan = new BeatLampManager(outlet);

export function bang() {
  beatLampMan.start();
}

export function stop() {
  beatLampMan.stop();
}

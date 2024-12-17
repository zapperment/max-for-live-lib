import { BeatLampManager } from "./BeatLampManager";

autowatch = 1;
inlets = 1;
outlets = 9;

setinletassist(0, "bang: start beat lamps; 'stop': stop beat lamps");
setoutletassist(0, "list: MIDI control change message, connect to midiout");
setoutletassist(1, "number: lamp 1 on (1) or off (0)");
setoutletassist(2, "number: lamp 2 on (1) or off (0)");
setoutletassist(3, "number: lamp 3 on (1) or off (0)");
setoutletassist(4, "number: lamp 4 on (1) or off (0)");
setoutletassist(5, "number: lamp 5 on (1) or off (0)");
setoutletassist(6, "number: lamp 6 on (1) or off (0)");
setoutletassist(7, "number: lamp 7 on (1) or off (0)");
setoutletassist(8, "number: lamp 8 on (1) or off (0)");

const beatLampMan = new BeatLampManager(outlet);

export function bang() {
  beatLampMan.start();
}

export function stop() {
  beatLampMan.stop();
}

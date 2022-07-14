import "../../polyfills/find";
import { getLiveTrackIndex, getObjectListProperty } from "../../util";

autowatch = 1;
inlets = 1;
outlets = 3;
setinletassist(0, "Bang: trigger check if any slots is playing");
setoutletassist(0, "Number: 0 is no slot is playing, otherwise 1");
setoutletassist(1, "Bang: any slot is playing");
setoutletassist(2, "Bang: no slot is playing");

export function bang() {
  const clipSlots = getObjectListProperty(
    `live_set tracks ${getLiveTrackIndex()} clip_slots`
  );
  const anySlotPlaying =
    clipSlots.find((clipSlot: LiveAPI) => clipSlot.get("is_playing")[0] > 0) !==
    undefined;
  outlet(0, anySlotPlaying ? 1 : 0);
  outlet(anySlotPlaying ? 1 : 2, "bang");
}

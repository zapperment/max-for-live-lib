import { getNumberProperty, getLiveTrackIndex } from "../../util";

autowatch = 1;
inlets = 1;
outlets = 3;
setinletassist(0, "Integer: fired slot index");
setoutletassist(0, "Bang: fired slot will start clip");
setoutletassist(1, "Bang: no slot has been fired");
setoutletassist(2, "Bang: fired slot will stop track");

export function msg_int(value: number) {
  if (value === -1) {
    outlet(1, "bang");
    return;
  }
  if (value !== -2) {
    const hasClip = getNumberProperty(
      `live_set tracks ${getLiveTrackIndex()} clip_slots ${value} has_clip`
    );
    if (hasClip) {
      outlet(0, "bang");
      return;
    }
  }
  outlet(2, "bang");
}

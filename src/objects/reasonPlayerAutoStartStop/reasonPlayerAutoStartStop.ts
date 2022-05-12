import { getLiveTrackIndex, log } from "../../util";

export function bang() {
  // @ts-ignore
  const api = new LiveAPI();
  const liveTrackIndex = getLiveTrackIndex(api);
  // @ts-ignore
  api.goto(observeFiredSlot, `live_set tracks ${liveTrackIndex} fired_slot_index`);
  /*
  api.path = `live_set tracks ${liveTrackIndex}`;
  api.property = "fired_slot_index";
   */
}

function observeFiredSlot(...args: any[]) {
  log("observed fired slot:", ...args)
}
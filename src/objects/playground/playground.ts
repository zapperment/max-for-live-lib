import { getLiveTrackIndex, log } from "../../util";

autowatch = 1;

export function bang() {
  const liveTrackIndex = getLiveTrackIndex();
  log("live track index:", liveTrackIndex);
  const track = new LiveAPI(`live_set tracks ${liveTrackIndex}`);
  log("track type:", track.type);
  log("clip slots:", track.get("clip_slots"));
  const clipSlotIds = track
    .get("clip_slots")
    .reduce((acc: (string | number)[][], curr: string | number) => {
      if (typeof curr === "string") {
        acc.push([curr]);
      } else {
        acc[acc.length - 1].push(curr);
      }
      return acc;
    }, []);
  log("clip slot IDs", clipSlotIds);
  for (let i = 0; i < clipSlotIds.length; i++) {
    const clipSlot = new LiveAPI(clipSlotIds[i]);
    log("clip slot", i, "has clip?", clipSlot.get("has_clip"));
  }
  log("number of clip slots:", clipSlotIds.length);
}

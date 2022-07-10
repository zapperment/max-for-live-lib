import { getLiveTrackIndex } from "./index";
import { log } from "../logger";

/**
 * Gets the ID of the Live track that the current Max device lives in
 */
export default function getLiveTrackId() {
  const liveTrackIndex = getLiveTrackIndex();
  let api;
  try {
    api = new LiveAPI(`live_set tracks ${liveTrackIndex}`);
  } catch (e) {
    log("getLiveTrackId failed");
    throw e;
  }
  return api.id;
}

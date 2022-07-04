import { getLiveTrackIndex } from "./index";

/**
 * Gets the ID of the Live track that the current Max device lives in
 */
export default function getLiveTrackId() {
  const liveTrackIndex = getLiveTrackIndex();
  const api = new LiveAPI(`live_set tracks ${liveTrackIndex}`);
  return api.id;
}

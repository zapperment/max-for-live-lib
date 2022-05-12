import { getLiveTrackIndex } from "./index";

/**
 * Gets the ID of the Live track that the current Max device lives in
 */
export default function getLiveTrackId(api: LiveAPI) {
  const liveTrackIndex = getLiveTrackIndex(api);
  api.path = `live_set tracks ${liveTrackIndex}`;
  return api.id;
}

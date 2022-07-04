import memoizeOne from "memoize-one";
import { isEqual } from "lodash";
import { getLiveTrackIndex } from "./index";

/**
 * Gets the Live track that the current Max device lives in, linked to the provided callback function.
 * The callback function is memoized, because for some reason, Max for Live invokes every API callback
 * again and again for every instance of the LiveAPI that is created.
 */
export default function getLiveTrack(
  callback: (tupel: [label: string, value: number]) => void
): LiveAPI {
  const liveTrackIndex = getLiveTrackIndex();
  return new LiveAPI(
    memoizeOne(callback, isEqual),
    `live_set tracks ${liveTrackIndex}`
  );
}

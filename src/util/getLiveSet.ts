import memoizeOne from "memoize-one";
import { isEqual } from "lodash";

/**
 * Gets the current Live set, which is the top level object of the Live Object Model.
 * The callback function is memoized, because for some reason, Max for Live invokes every API callback
 * again and again for every instance of the LiveAPI that is created.
 */
export default function getLiveSet(
  callback: (tupel: [label: string, value: number]) => void
): LiveAPI {
  return new LiveAPI(
    memoizeOne(callback, isEqual),
    `live_set`
  );
}

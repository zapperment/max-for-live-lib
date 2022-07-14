import memoizeOne from "memoize-one";
import { isEqual } from "lodash";
import splitPath from "./splitPath";

export default function observe(
  path: string,
  callback: (value: number) => void
) {
  const [objectPath, property] = splitPath(path);
  const observedObject = new LiveAPI(memoizeOne(([label, value]: [string, number]) => {
      if (label !== property) {
        return;
      }
      callback(value);
  },isEqual), objectPath);
  observedObject.property = property;
  return observedObject.get(property)[0];
}

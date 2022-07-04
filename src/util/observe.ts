import { isEqual } from "lodash";
import memoizeOne from "memoize-one";

export default function observe(
  path: string,
  callback: (value: number) => void
) {
  const [, objectPath, property] = path.match(/^(.+) ([a-z_]+)$/) || [];
  if (!objectPath || !property) {
    throw new Error(`Invalid path: ${path}`);
  }
  const observedObject = new LiveAPI(
    memoizeOne(([label, value]) => {
      if (label !== property) {
        return;
      }
      callback(value);
    }, isEqual),
    objectPath
  );
  observedObject.property = property;
  return observedObject;
}

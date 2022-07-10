import { log } from "../logger";
import splitPath from "./splitPath";

export default function observe(
  path: string,
  callback: (value: number) => void
) {
  const [objectPath, property] = splitPath(path);
  let observedObject;
  try {
    observedObject = new LiveAPI(([label, value]: [string, number]) => {
      log(`Observed: ${label} = ${value}`);
      if (label !== property) {
        return;
      }
      callback(value);
    }, objectPath);
  } catch (e) {
    log(`observe ${path} failed`);
    throw e;
  }
  observedObject.property = property;
  return observedObject.get(property)[0];
}

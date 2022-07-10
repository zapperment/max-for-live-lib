import { log } from "../logger";
import splitPath from "./splitPath";

export default function getProperty(path: string) {
  const [objectPath, property] = splitPath(path);
  let object;
  try {
    object = new LiveAPI(objectPath);
  } catch (e) {
    log(`getProperty ${path} failed`);
    throw e;
  }
  return object.get(property)[0];
}

import splitPath from "./splitPath";

export default function getNumberProperty(path: string) {
  const [ objectPath, property] = splitPath(path);
  return new LiveAPI(objectPath).get(property)[0];
}
import splitPath from "./splitPath";

export default function getProperty(path: string) {
  const [ objectPath, property] = splitPath(path);
  return new LiveAPI(objectPath).get(property)[0];
}
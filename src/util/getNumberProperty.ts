import splitPath from "./splitPath";

export default function getProperty(path: string) {
  const [ objectPath, property] = splitPath(path);
  const object = new LiveAPI(objectPath);
  return object.get(property)[0];
}
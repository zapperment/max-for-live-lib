import splitPath from "./splitPath";

export default function setProperty(path: string, value: number) {
  const [objectPath, property] = splitPath(path);
  const object = new LiveAPI(objectPath);
  return object.set(property, value);
}

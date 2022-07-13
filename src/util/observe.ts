import splitPath from "./splitPath";

export default function observe(
  path: string,
  callback: (value: number) => void
) {
  const [objectPath, property] = splitPath(path);
  const observedObject = new LiveAPI(([label, value]: [string, number]) => {
    if (label !== property) {
      return;
    }
    callback(value);
  }, objectPath);
  observedObject.property = property;
  return observedObject.get(property)[0];
}

export default function observe(
  path: string,
  callback: (value: number) => void
) {
  const [, objectPath, property] = path.match(/^(.+) ([a-z_]+)$/) || [];
  if (!objectPath || !property) {
    throw new Error(`Invalid path: ${path}`);
  }
  const observedObject = new LiveAPI(([label, value]: [string, number]) => {
    if (label !== property) {
      return;
    }
    callback(value);
  }, objectPath);
  observedObject.property = property;
  return observedObject.get(property)[0];
}

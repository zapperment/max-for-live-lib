export default function getProperty(path: string) {
  const [, objectPath, property] = path.match(/^(.+) ([a-z_]+)$/) || [];
  if (!objectPath || !property) {
    throw new Error(`Invalid path: ${path}`);
  }
  const object = new LiveAPI(objectPath);
  object.property = property;
  return object.get(property)[0];
}

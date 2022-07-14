export default function splitPath(path: string) {
  const [, objectPath, property] = path.match(/^(.+) ([a-z_]+)$/) || [];
  if (!objectPath || !property) {
    throw new Error(`Invalid path: ${path}`);
  }
  return [objectPath, property];
}
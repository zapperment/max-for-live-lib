import splitPath from "./splitPath";

export default function getObjectListProperty(path: string): LiveAPI[] {
  const [objectPath, property] = splitPath(path);
  const api = new LiveAPI(objectPath);
  const numberOfPropertyValues = api.getcount(property);
  const result = [];
  for (let i = 0; i < numberOfPropertyValues; i++) {
    result.push(new LiveAPI(`${path} ${i}`));
  }
  return result;
}

import splitPath from "./splitPath";
import log from "./log";

export default function getObjectListProperty(path: string): LiveAPI[] {
  const [objectPath, property] = splitPath(path);
  log("[getObjectListProperty] objectPath:", objectPath);
  log("[getObjectListProperty] property:", property);
  const api = new LiveAPI(objectPath);
  const numberOfPropertyValues = api.getcount(property);
  const result = [];
  for (let i = 0; i < numberOfPropertyValues; i++) {
    result.push(new LiveAPI(`${path} ${i}`));
  }
  return result;

  /*   return new LiveAPI(objectPath)
    .get(property)
    .reduce((acc: (string | number)[][], curr: string | number) => {
      if (typeof curr === "string") {
        acc.push([curr]);
      } else {
        acc[acc.length - 1].push(curr);
      }
      return acc;
    }, [])
    .map((id: (string | number)[]) => new LiveAPI(id)); */
}

import splitPath from "./splitPath";

export default function getProperty(path: string) {
  const [objectPath, property] = splitPath(path);
  return new LiveAPI(objectPath)
    .get(property)
    .reduce((acc: (string | number)[][], curr: string | number) => {
      if (typeof curr === "string") {
        acc.push([curr]);
      } else {
        acc[acc.length - 1].push(curr);
      }
      return acc;
    }, [])
    .map((id: (string | number)[]) => new LiveAPI(id));
}

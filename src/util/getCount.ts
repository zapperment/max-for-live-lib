export default function getCount(id: string) {
  const tokens = id.split(" ");
  const property = tokens[tokens.length - 1];
  const path = tokens.slice(0, tokens.length - 1).join(" ");
  return new LiveAPI(path).getcount(property);
}

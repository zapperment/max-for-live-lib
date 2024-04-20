export default function getObjectById(id: number) {
  return new LiveAPI(["id", id]);
}

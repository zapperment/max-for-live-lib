import convertStringNumberArrayToIds from "./convertStringNumberArrayToIds";

export default function getControlSurfaceNames() {
  return convertStringNumberArrayToIds(
    new LiveAPI("live_app").get("control_surfaces"),
  ).map((id) => new LiveAPI(id).type);
}

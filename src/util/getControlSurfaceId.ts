import convertStringNumberArrayToIds from "./convertStringNumberArrayToIds";

export default function getControlSurfaceId(controlSurfaceName: string) {
  const controlSurfaceId = convertStringNumberArrayToIds(
    new LiveAPI("live_app").get("control_surfaces"),
  ).filter((id) => new LiveAPI(id).type === controlSurfaceName)?.[0];
  if (!controlSurfaceId) {
    throw new Error(
      `Could not find control surface ${controlSurfaceName} - make sure the device is connected`,
    );
  }
  return controlSurfaceId;
}

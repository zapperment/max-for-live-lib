import { log, getControlSurfaceId, getControlSurfaceNames } from "../../util";

let controlSurfaceName: string | null = null;
let controlName: string | null = null;

export function bang() {
  if (!controlSurfaceName || !controlName) {
    return;
  }
  const controlSurfaceId = getControlSurfaceId(controlSurfaceName);
  const control = new LiveAPI(controlSurfaceId).call(
    "get_control",
    controlName,
  );
  outlet(0, control);
}

export function set_surface(nextControlSurfaceName: string) {
  controlSurfaceName = nextControlSurfaceName;
  if (controlName) {
    bang();
  }
}

export function set_control(nextControlName: string) {
  controlName = nextControlName;
  if (controlSurfaceName) {
    bang();
  }
}

export function list_surfaces() {
  for (const controlSurfaceName of getControlSurfaceNames()) {
    outlet(0, controlSurfaceName);
  }
}

export function list_controls() {
  if (!controlSurfaceName) {
    return;
  }
  const controlSurfaceId = getControlSurfaceId(controlSurfaceName);
  const controlNames = new LiveAPI(controlSurfaceId)
    .call("get_control_names")
    .filter((str: string) => {
      return (
        str !== "control" &&
        str !== "control_names" &&
        isNaN(Number(str)) &&
        str !== "done"
      );
    });
  for (const controlName of controlNames) {
    outlet(0, controlName);
  }
}

import type { Id } from "../../types";
import {
  log,
  getControlSurfaceId,
  getControlSurfaceNames,
  getObjectById,
} from "../../util";

let controlSurfaceName: string | null = null;
let controlName: string | null = null;

export function bang() {
  if (!controlSurfaceName || !controlName) {
    return;
  }
  const controlSurfaceId = getControlSurfaceId(controlSurfaceName);
  const controlId: Id = new LiveAPI(controlSurfaceId).call(
    "get_control",
    controlName,
  );
  outlet(0, controlId);
}

export function observe() {
  if (!controlSurfaceName || !controlName) {
    return;
  }
  const controlSurfaceId = getControlSurfaceId(controlSurfaceName);
  const controlId: Id = new LiveAPI(controlSurfaceId).call(
    "get_control",
    controlName,
  );
  const control = new LiveAPI((value: any) => {
    outlet(0, value.slice(1));
  });
  control.id = controlId[1];
  control.property = "value";
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

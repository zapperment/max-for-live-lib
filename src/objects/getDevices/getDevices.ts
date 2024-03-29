import { getLiveTrackIndex, getObjectListProperty } from "../../util";

autowatch = 1;
outlets = 2;

setinletassist(0, "Bang: trigger output");
setoutletassist(
  0,
  "String: device name (for each device, a string message is sent)"
);
setoutletassist(1, "List: device IDs");

export function bang() {
  const path = `live_set tracks ${getLiveTrackIndex()} devices`;
  const devices = getObjectListProperty(path);
  outlet(
    1,
    devices.map((device) => device.id)
  );
  devices.forEach((device) => outlet(0, device.get("name")[0]));
}

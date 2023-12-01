import { getLiveTrackIndex, getObjectListProperty, log } from "../../util";

autowatch = 1;
outlets = 3;

setinletassist(0, "Bang: trigger output");
setoutletassist(
  0,
  "String: a string to create a message to initialize a live.menu's range attribute"
);
setoutletassist(1, "List: device names");
setoutletassist(2, "List: device IDs");

// M4L can't handle more than 9 changeable args in a message
// let's not make things too complicated and leave it at that
const MAX_ITEMS = 9;

export function bang() {
  const path = `live_set tracks ${getLiveTrackIndex()} devices`;
  // for track 1, this will log:
  // "live_set tracks 0 devices"
  // for track 2, this will log:
  // "live_set tracks 1 devices"
  log("[getDevices] path:", path);
  const devices = getObjectListProperty(path).slice(0, MAX_ITEMS);
  outlet(0, [
    "set",
    "_parameter_range",
    ...devices.map((x, i) => `\$${i + 1}`),
  ]);
  outlet(
    1,
    devices.map((device) => device.get("name")[0])
  );
  outlet(
    2,
    devices.map((device) => device.id)
  );
}

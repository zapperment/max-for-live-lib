import { getObjectListProperty, log } from "../../util";

autowatch = 1;
outlets = 3;

// M4L can't handle more than 9 changeable args in a message
// let's not make things too complicated and leave it at that
const MAX_ITEMS = 9;

export function bang() {
  const parameters = getObjectListProperty(
    "live_set tracks 0 devices 1 parameters"
  ).slice(0, MAX_ITEMS);
  outlet(0, [
    "set",
    "_parameter_range",
    ...parameters.map((x, i) => `\$${i + 1}`),
  ]);
  outlet(
    1,
    parameters.map((parameter) => parameter.get("name")[0])
  );
  outlet(
    2,
    parameters.map((parameter) => parameter.id)
  );
}

import { getObjectById, getObjectListProperty } from "../../util";

autowatch = 1;
outlets = 3;

setinletassist(0, "ID: the ID of a device");
setoutletassist(0, "String: a string to create a message to initialize a live.menu's range attribute");
setoutletassist(1, "List: parameter names");
setoutletassist(2, "List: parameter IDs");

// M4L can't handle more than 9 changeable args in a message
// let's not make things too complicated and leave it at that
const MAX_ITEMS = 9;

export function id(id: number) {
  const parameters = getObjectListProperty(
    `${getObjectById(id).path} parameters`
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

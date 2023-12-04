import { getObjectById, getObjectListProperty } from "../../util";

autowatch = 1;
outlets = 2;

setinletassist(0, "ID: the ID of a device");
setoutletassist(
  0,
  "String: parameter name (for each parameter, a string message is sent)"
);
setoutletassist(1, "List: parameter IDs");

export function id(id: number) {
  // need to slice off enclosing double quotes that Max adds to the path of the object
  const path = `${getObjectById(id).path.slice(1, -1)} parameters`;
  const parameters = getObjectListProperty(path);
  parameters.forEach((parameter) => outlet(0, parameter.get("name")[0]));
  outlet(
    1,
    parameters.map((parameter) => parameter.id)
  );
}

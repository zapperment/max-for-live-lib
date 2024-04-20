import { convertStringNumberArrayToIds } from "../../util";

autowatch = 1;
outlets = 3;

setinletassist(0, "type: name of control surface, e.g. 'SLMkIII'");
setoutletassist(
  0,
  "list: the ID of the 1st control surface with the specified type"
);
setoutletassist(
  1,
  "list: the ID of the 2nd control surface with the specified type"
);
setoutletassist(
  2,
  "list: the ID of the 3rd control surface with the specified type"
);

export function type(type: string) {
  const controlSurfaceIds = convertStringNumberArrayToIds(
    new LiveAPI("live_app").get("control_surfaces")
  );
  let outletIndex = 0;
  for (const id of controlSurfaceIds) {
    const currentType = new LiveAPI(id).type;
    if (currentType === type) {
      outlet(outletIndex++, id);
      if (outletIndex === 3) {
        break;
      }
    }
  }
}

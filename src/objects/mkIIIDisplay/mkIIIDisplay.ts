import { convertStringNumberArrayToIds } from "../../util";

setinletassist(0, "send [column] [text]");

autowatch = 1;
outlets = 0;

const controlSurfaceName = "SLMkIII";

const sysExHeader = [240, 0, 32, 41, 2, 10, 1];
const setScreenProperties = 2;
const setText = 1;
const row = 0;
const endOfValueString = 0;
const endOfSysExMessage = 247;

export function send(column: number, ...values: string[]) {
  const controlSurfaceIds = convertStringNumberArrayToIds(
    new LiveAPI("live_app").get("control_surfaces")
  ).filter((id) => new LiveAPI(id).type === controlSurfaceName);
  if (controlSurfaceIds.length === 0) {
    throw new Error(
      `Could not find control surface ${controlSurfaceName} - make sure the keyboard is connected`
    );
  }
  const bytes = [
    ...sysExHeader,
    setScreenProperties,
    column,
    setText,
    row,
    ...values
      .join(" ")
      .split("")
      .map((letter) => letter.charCodeAt(0)),
    endOfValueString,
    endOfSysExMessage,
  ];
  for (const controlSurfaceId of controlSurfaceIds) {
    new LiveAPI(controlSurfaceId).call("send_receive_sysex", ...bytes);
  }
}

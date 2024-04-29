import log from "../../util/log";

autowatch = 1;
outlets = 1;

setinletassist(0, "list: message 'change scriptingName shortName'");
setoutletassist(
  0,
  "bang: when short name of object with scripting name was changed successfully"
);

export function change(scriptingName: string, ...shortNameSegments: string[]) {
  log(`version 8`);
  log(`scripting name: ${scriptingName} `);
  log(`short name: ${shortNameSegments.join(" ")} `);
  // @ts-ignore
  log(`patcher name: ${jsthis.patcher.name}`);
  outlet(0, "bang");
}

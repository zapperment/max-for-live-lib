import {
  ApiManager,
  mt,
  log,
  getLiveTrackIndex,
  getObjectListProperty,
} from "../../util";

import type { State } from "./types";

export default class AutoFallbackManager {
  private _state: State = {};

  private _apiMan = new ApiManager();

  private _outlet;

  constructor(outlet: (outlet_number: number, ...args: unknown[]) => void) {
    this._outlet = outlet;
  }

  start() {
    if (this._apiMan.hasNoApis) {
      // get the IDs of all the parameters of all devices on the current track
      const trackIndex = getLiveTrackIndex();
      const devices = getObjectListProperty(
        `live_set tracks ${trackIndex} devices`,
      );
      for (let deviceIndex = 0; deviceIndex < devices.length; deviceIndex++) {
        const device = devices[deviceIndex];
        log("device", deviceIndex, device.get("name"));
        const parameters = getObjectListProperty(
          `live_set tracks ${trackIndex} devices ${deviceIndex} parameters`,
        );
        for (
          let parameterIndex = 0;
          parameterIndex < parameters.length;
          parameterIndex++
        ) {
          const parameter = parameters[parameterIndex];
          const name = parameter.get("name")[0];
          const id = parameter.id;
          this._state[id] = { isAutomated: null, fallbackValue: null };
          const automationStateObserver = this._apiMan.make(
            `live_set tracks ${trackIndex} devices ${deviceIndex} parameters ${parameterIndex} automation_state`,
            (automationState) => {
              log(name, "automation state:", automationState);
              const isAutomated = automationState === 1;
              log(name, "is automated:", isAutomated);
              const prevIsAutomated = this._state[id].isAutomated;
              this._state[id].isAutomated = isAutomated;
              if (!isAutomated && prevIsAutomated) {
                const fallbackValue = this._state[id].fallbackValue;
                log("set", name, "value back to fallback", fallbackValue);
                outlet(0, [fallbackValue, id]);
              }
            },
          );
          const valueObserver = this._apiMan.make(
            `live_set tracks ${trackIndex} devices ${deviceIndex} parameters ${parameterIndex} value`,
            (value) => {
              log(name, "value", value);
              const isAutomated = this._state[id].isAutomated;
              if (isAutomated === null || isAutomated) {
                log(name, "automated, not setting new fallback value");
                return;
              }
              if (this._state[id].fallbackValue === value) {
                return;
              }
              log("setting new fallback value", value, "for", name);
              this._state[id].fallbackValue = value;
            },
          );
        }
      }
    }
    this._apiMan.start();
  }

  stop() {}
}

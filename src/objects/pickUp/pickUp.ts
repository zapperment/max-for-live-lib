import { log } from "../../util";

export const autowatch = 1;
export const inlets = 2;
export const outlets = 1;

let pickupValue = 127;
let recentlySet = false;
let direction: "up" | "down" = "up";
let isOpen = false;

export function msg_int(value: number) {
  if (inlet === 1) {
    log("inlet 2 received value", value);
    log("pick up value set to", value);
    pickupValue = value;
    recentlySet = true;
    isOpen = false;
    return;
  }
  log("inlet 1 received value", value);
  if (isOpen) {
    log("pick up is already open");
    log("sending value", value, "to outlet 1");
    outlet(0, value);
    return;
  }
  if (recentlySet) {
    log("pick up was recently set");
    recentlySet = false;
    if (value < pickupValue) {
      log("below pick up value, direction is up");
      direction = "up";
      return;
    }
    if (value > pickupValue) {
      log("below pick up value, direction is down");
      direction = "down";
      return;
    }
    log("value matches pickup value");
    log("sending value", value, "to outlet 1");
    isOpen = true;
    outlet(0, value);
  }
  if (direction === "up" && value < pickupValue) {
    log("value is below pick up value, pick up stays closed");
    return;
  }
  if (direction === "down" && value > pickupValue) {
    log("value is above pick up value, pick up stays closed");
    return;
  }
  log("pick up value reached, pick up is now open");
  isOpen = true;
  outlet(0, value);
}

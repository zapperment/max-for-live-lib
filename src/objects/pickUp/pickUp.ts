autowatch = 1;
inlets = 2;
outlets = 1;

let pickupValue = 127;
let recentlySet = false;
let direction: "up" | "down" = "up";
let isOpen = false;

export function msg_int(value: number) {
  if (inlet === 1) {
    pickupValue = value;
    recentlySet = true;
    isOpen = false;
    return;
  }
  if (isOpen) {
    outlet(0, value);
    return;
  }
  if (recentlySet) {
    recentlySet = false;
    if (value < pickupValue) {
      direction = "up";
      return;
    }
    if (value > pickupValue) {
      direction = "down";
      return;
    }
    isOpen = true;
    outlet(0, value);
  }
  if (direction === "up" && value < pickupValue) {
    return;
  }
  if (direction === "down" && value > pickupValue) {
    return;
  }
  isOpen = true;
  outlet(0, value);
}

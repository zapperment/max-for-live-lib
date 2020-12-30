import { log } from "./util";

export const autowatch = 1;
export const inlets = 1;
export const outlets = 2;

const CHANNEL_1_CC = 176;

export function anything() {
  const msg = arrayfromargs(messagename, arguments);
  const statusByte = msg[0];
  const controllerNumber = msg[1];
  const value = msg[2];

  if (statusByte == CHANNEL_1_CC && controllerNumber == jsarguments[1]) {
    const thisDeviceTrack = new LiveAPI("this_device canonical_parent");
    const selectedTrack = new LiveAPI("live_set view selected_track");
    if (thisDeviceTrack.id === selectedTrack.id) {
      log("received MIDI control change ", controllerNumber, value);
      outlet(0, value);
      return;
    }
  }
  // pass the MIDI message on for chaining
  outlet(1, msg);
}

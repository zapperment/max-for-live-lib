import { log } from "../../util";

export const autowatch = 1;
export const inlets = 0;
export const outlets = 4;

export function bang() {
  const api = new LiveAPI((val: [string, number]) => {
    const currentSongTime = val[1];
    const currentBar = Math.floor(currentSongTime / 4) + 1;
    const currentBeat = Math.floor(currentSongTime % 4) + 1;
    outlet(currentBeat - 1, "bang");
  }, "live_set");
  api.property = "current_song_time";
}

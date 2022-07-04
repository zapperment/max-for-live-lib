import { getLiveTrackIndex, log, observe } from "../../util";

export default class Replass {
  private _lastBeat = 0;
  constructor() {
    observe(
      `live_set tracks ${getLiveTrackIndex()} fired_slot_index`,
      (firedSlotIndex) => {
        log("Fired slot index:", firedSlotIndex);
      }
    );

    observe("live_set current_song_time", (currentBeat) => {
      const nextBeat = Math.floor(currentBeat);
      if (nextBeat > this._lastBeat) {
        this._lastBeat = nextBeat;
        log("Current beat:", currentBeat);
      }
    });
  }
}

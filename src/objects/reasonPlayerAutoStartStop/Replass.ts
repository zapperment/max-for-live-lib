import { getLiveTrackIndex, log, observe } from "../../util";
import convertClipTriggerQuantizationToBeats from "./convertClipTriggerQuantizationToBeats";

interface ObservedProperties {
  firedSlotIndex: number;
  clipTriggerQuantization: number;
  isPlaying: number;
  currentSongTime: number;
  signatureNumerator: number;
  signatureDenominator: number;
}

interface HandlerMethods {
  handleFiredSlotIndexChange: Function;
  handleCurrentSongTimeChange: Function;
}

export default class Replass implements ObservedProperties, HandlerMethods {
  firedSlotIndex!: number;
  clipTriggerQuantization!: number;
  isPlaying!: number;
  currentSongTime!: number;
  signatureNumerator!: number;
  signatureDenominator!: number;

  private prevBeat: number = 0;
  private nextClipStartTime: number = Number.MAX_SAFE_INTEGER;
  private nextClipStopTime: number = Number.MAX_SAFE_INTEGER;

  constructor() {
    const observedProperties: {
      path: string;
      property: keyof ObservedProperties;
      handler?: keyof HandlerMethods;
    }[] = [
      {
        path: `live_set tracks ${getLiveTrackIndex()} fired_slot_index`,
        property: "firedSlotIndex",
        handler: "handleFiredSlotIndexChange",
      },
      {
        path: "live_set clip_trigger_quantization",
        property: "clipTriggerQuantization",
      },
      {
        path: "live_set is_playing",
        property: "isPlaying",
      },
      {
        path: "live_set current_song_time",
        property: "currentSongTime",
        handler: "handleCurrentSongTimeChange",
      },
      {
        path: "live_set signature_numerator",
        property: "signatureNumerator",
      },
      {
        path: "live_set signature_denominator",
        property: "signatureDenominator",
      },
    ];
    for (const { path, property, handler } of observedProperties) {
      this[property] = observe(path, (value) => {
        const isInitializing = !this[property];
        this[property] = value;
        if (!isInitializing && handler) {
          this[handler]();
        }
      });
    }
  }

  handleFiredSlotIndexChange() {
    if (this.firedSlotIndex === -1) {
      return;
    }
    const clipTriggerQuantizationInBeats = convertClipTriggerQuantizationToBeats(
      this.clipTriggerQuantization,
      this.signatureNumerator,
      this.signatureDenominator
    );
    const elapsedQuantizationSpans = Math.floor(
      this.currentSongTime / clipTriggerQuantizationInBeats
    );
    const nextQuantizationSpanTime =
      elapsedQuantizationSpans * clipTriggerQuantizationInBeats +
      clipTriggerQuantizationInBeats;
    if (this.firedSlotIndex === -2) {
      // clip stop was triggerd
      log("Slot stop fired");
      this.nextClipStopTime = nextQuantizationSpanTime;
      this.nextClipStartTime = Number.MAX_SAFE_INTEGER;
      log("Next clip stop time:", this.nextClipStopTime);
    } else {
      // clip start was triggered
      log("Slot start fired:", this.firedSlotIndex);
      this.nextClipStartTime = nextQuantizationSpanTime;
      this.nextClipStopTime = Number.MAX_SAFE_INTEGER;
      log("Next clip start time:", this.nextClipStartTime);
    }
  }

  handleCurrentSongTimeChange() {
    const nextBeat = Math.floor(this.currentSongTime);
    if (nextBeat > this.prevBeat) {
      this.prevBeat = nextBeat;
      log("The beat:", nextBeat);
    }
    if (this.currentSongTime > this.nextClipStartTime) {
      this.nextClipStartTime = Number.MAX_SAFE_INTEGER;
      log("*** CLIP STARTED ***");
    }
    if (this.currentSongTime > this.nextClipStopTime) {
      this.nextClipStopTime = Number.MAX_SAFE_INTEGER;
      log("*** CLIP STOPPED ***");
    }
  }
}

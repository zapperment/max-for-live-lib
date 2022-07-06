import { isInteger } from "lodash";
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
  private nextClipTriggerTime: number = Number.MAX_SAFE_INTEGER;

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
        this[property] = value;
        if (handler) {
          this[handler]();
        }
      });
    }
  }

  handleFiredSlotIndexChange() {
    if (this.firedSlotIndex < 0) {
      return;
    }
    log("Slot fired:", this.firedSlotIndex);
    const clipTriggerQuantizationInBeats = convertClipTriggerQuantizationToBeats(
      this.clipTriggerQuantization,
      this.signatureNumerator,
      this.signatureDenominator
    );
    const elapsedQuantizationSpans = Math.floor(
      this.currentSongTime / clipTriggerQuantizationInBeats
    );
    this.nextClipTriggerTime =
      elapsedQuantizationSpans * clipTriggerQuantizationInBeats +
      clipTriggerQuantizationInBeats;
    log("Clip trigger quantization in beats:", clipTriggerQuantizationInBeats);
    log("Next clip trigger time:", this.nextClipTriggerTime);
  }

  handleCurrentSongTimeChange() {
    const nextBeat = Math.floor(this.currentSongTime);
    if (nextBeat > this.prevBeat) {
      this.prevBeat = nextBeat;
      log("The beat:", nextBeat);
    }
    if (this.currentSongTime > this.nextClipTriggerTime) {
      this.nextClipTriggerTime = Number.MAX_SAFE_INTEGER;
      log("BOOOOOYA!!!1!!!!");
    }
  }
}

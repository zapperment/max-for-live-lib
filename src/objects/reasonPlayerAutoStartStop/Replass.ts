import {
  getLiveTrackIndex,
  getNumberProperty,
  outLog,
  observe,
} from "../../util";

import convertClipTriggerQuantizationToBeats from "./convertClipTriggerQuantizationToBeats";

const OFFSET = 0.1;

interface ObservedProperties {
  firedSlotIndex: number;
  clipTriggerQuantization: number;
  isPlaying: number;
  currentSongTime: number;
  signatureNumerator: number;
  signatureDenominator: number;
}

interface HandlerMethods {
  handleIsPlayingChange: Function;
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

  private nextClipStartTime: number = Number.MAX_SAFE_INTEGER;
  private nextClipStopTime: number = Number.MAX_SAFE_INTEGER;

  constructor() {
    const liveTrackIndex = getLiveTrackIndex();
    outlet(2, liveTrackIndex);
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
        handler: "handleIsPlayingChange",
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
    if (this.firedSlotIndex !== -2) {
      const hasClip = getNumberProperty(
        `live_set tracks ${getLiveTrackIndex()} clip_slots ${
          this.firedSlotIndex
        } has_clip`
      );
      if (hasClip) {
        // clip start was triggered
        this.nextClipStartTime = nextQuantizationSpanTime - OFFSET;
        this.nextClipStopTime = Number.MAX_SAFE_INTEGER;
        outLog(
          3,
          `Next clip slot ${this.firedSlotIndex} start time: ${this.nextClipStartTime}`
        );
        return;
      }
    }
    // clip stop was triggered
    this.nextClipStopTime = nextQuantizationSpanTime - OFFSET;
    this.nextClipStartTime = Number.MAX_SAFE_INTEGER;
    outLog(
      3,
      `Next clip slot ${this.firedSlotIndex} stop time: ${this.nextClipStopTime}`
    );
  }

  handleCurrentSongTimeChange() {
    if (this.currentSongTime > this.nextClipStartTime) {
      outlet(0, "bang");
      this.nextClipStartTime = Number.MAX_SAFE_INTEGER;
      outLog(3, "*** CLIP STARTED! ***");
    }
    if (this.currentSongTime > this.nextClipStopTime) {
      outlet(1, "bang");
      this.nextClipStopTime = Number.MAX_SAFE_INTEGER;
      outLog(3, "*** CLIP STOPPED! ***");
    }
  }

  handleIsPlayingChange() {
    outLog(3, `Is it playing? ${this.isPlaying}`);
  }
}

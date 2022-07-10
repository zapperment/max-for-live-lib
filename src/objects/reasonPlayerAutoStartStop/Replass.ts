import { getLiveTrackIndex, getProperty, observe } from "../../util";
import { log } from "../../logger";
import convertClipTriggerQuantizationToBeats from "./convertClipTriggerQuantizationToBeats";

const OFFSET = 0.1;

interface ObservedProperties {
  firedSlotIndex: number;
  clipTriggerQuantization: number;
  isPlaying: number;
  signatureNumerator: number;
  signatureDenominator: number;
}

interface HandlerMethods {
  handleFiredSlotIndexChange: Function;
}

export default class Replass implements ObservedProperties, HandlerMethods {
  firedSlotIndex!: number;
  clipTriggerQuantization!: number;
  isPlaying!: number;
  signatureNumerator!: number;
  signatureDenominator!: number;

  ready = false;
  firstUpdate = true;

  private nextClipStartTime: number = Number.MAX_SAFE_INTEGER;
  private nextClipStopTime: number = Number.MAX_SAFE_INTEGER;
  private liveTrackIndex;

  constructor() {
    this.liveTrackIndex = getLiveTrackIndex();
    outlet(2, this.liveTrackIndex);
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
    this.ready = true;
    log("Initialized");
  }

  handleFiredSlotIndexChange() {
    log("Handle fired slot index change");
    if (this.firedSlotIndex === -1) {
      return;
    }
    const currentSongTime = this.getCurrentSongTime();
    const clipTriggerQuantizationInBeats = convertClipTriggerQuantizationToBeats(
      this.clipTriggerQuantization,
      this.signatureNumerator,
      this.signatureDenominator
    );
    const elapsedQuantizationSpans = Math.floor(
      currentSongTime / clipTriggerQuantizationInBeats
    );
    const nextQuantizationSpanTime =
      elapsedQuantizationSpans * clipTriggerQuantizationInBeats +
      clipTriggerQuantizationInBeats;
    if (this.firedSlotIndex !== -2) {
      const hasClip = getProperty(
        `live_set tracks ${this.liveTrackIndex} clip_slots ${this.firedSlotIndex} has_clip`
      );
      if (hasClip) {
        // clip start was triggered
        this.nextClipStartTime = nextQuantizationSpanTime - OFFSET;
        this.nextClipStopTime = Number.MAX_SAFE_INTEGER;
        log(
          `Next clip slot ${this.firedSlotIndex} start time: ${this.nextClipStartTime}`
        );
        return;
      }
    }
    // clip stop was triggerd
    this.nextClipStopTime = nextQuantizationSpanTime - OFFSET;
    this.nextClipStartTime = Number.MAX_SAFE_INTEGER;
    log(
      `Next clip slot ${this.firedSlotIndex} stop time: ${this.nextClipStopTime}`
    );
  }

  update() {
    if (this.firstUpdate) {
      log("First update");
      this.firstUpdate = false;
    }
    const currentSongTime = this.getCurrentSongTime();
    if (currentSongTime > this.nextClipStartTime) {
      outlet(0, "bang");
      this.nextClipStartTime = Number.MAX_SAFE_INTEGER;
      log("Clip started");
    }
    if (currentSongTime > this.nextClipStopTime) {
      outlet(1, "bang");
      this.nextClipStopTime = Number.MAX_SAFE_INTEGER;
        log("Clip stopped");
      }
  }

  private getCurrentSongTime() {
    return getProperty("live_set current_song_time");
  }
}

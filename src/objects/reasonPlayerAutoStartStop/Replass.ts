import { getLiveTrackIndex, log, observe } from "../../util";

interface ObservedProperties {
  firedSlotIndex: number;
  clipTriggerQuantization: number;
  isPlaying: number;
  currentSongTime: number;
  signatureNumerator: number;
  signatureDenominator: number;
}

export default class Replass implements ObservedProperties {
  firedSlotIndex!: number;
  clipTriggerQuantization!: number;
  isPlaying!: number;
  currentSongTime!: number;
  signatureNumerator!: number;
  signatureDenominator!: number;

  constructor() {
    const observedProperties: {
      path: string;
      property: keyof ObservedProperties;
      handler?: Function;
    }[] = [
      {
        path: `live_set tracks ${getLiveTrackIndex()} fired_slot_index`,
        property: "firedSlotIndex",
        handler: this.handleFiredSlotIndexChange,
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
          handler();
        }
      });
    }
  }

  handleFiredSlotIndexChange() {
    log("Handling the shmandling!!1!");
  }
}

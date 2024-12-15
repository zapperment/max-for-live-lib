import "core-js/actual/array/includes";
import type { State, StateProp, CalculationInput } from "../types";
import {
  ApiManager,
  convertClipTriggerQuantisationToBeats,
  log,
} from "../../../util";
import {
  loggedStateProps,
  numberOfLamps,
  lampColours,
  lampStateResolution,
} from "../config";

const observedLiveSetProps: StateProp[] = [
  "clip_trigger_quantization",
  "signature_numerator",
  "signature_denominator",
  "is_playing",
  "current_song_time",
];

export default class BeatLampManager {
  private _state: State = {
    clip_trigger_quantization: null,
    signature_numerator: null,
    signature_denominator: null,
    is_playing: null,
    current_song_time: null,
    current_song_time_fraction: null,
    ctq_beats: null,
    ctq_fractions: null,
    elapsed_quantization_spans: null,
    lamp_state: null,
    current_beat_in_span: null,
    current_fraction_in_span: null,
    current_lamp: null,
  };

  private _apiMan = new ApiManager();

  private _outlet;

  constructor(outlet: (outlet_number: number, ...args: unknown[]) => void) {
    this._outlet = outlet;
  }

  start() {
    if (this._apiMan.hasNoApis) {
      observedLiveSetProps.forEach(this._observeLiveSet.bind(this));
    }
    this._apiMan.start();
  }

  stop() {
    this._apiMan.stop();
  }

  private _observeLiveSet(prop: StateProp) {
    this._observeState("live_set", prop);
  }

  private _observeState(path: string, prop: StateProp) {
    this._apiMan.make(`${path} ${prop}`, (nextValue) => {
      const changedValue = this._doStateUpdateIfChanged(prop, nextValue);
      if (changedValue !== null) {
        this._updateDerivedState();
      }
    });
  }

  private _updateDerivedState() {
    this._updateCtqBeats();
    this._updateCtqFractions();
    //const lampStateHasChanged = this._updateLampState();
    this._updateElapsedQuantisationSpans();
    this._updateCurrentBeatInSpan();
    this._updateCurrentFractionInSpan();
    this._updateCurrentLamp();
    const currentSongTimeFractionHasChanged =
      this._updateCurrentSongTimeFraction();
    if (currentSongTimeFractionHasChanged) {
      this._sendLampMidiMessage();
    }
  }

  private _updateDerivedStateProp(
    prop: StateProp,
    requiredProps: StateProp[],
    calculate: (props: CalculationInput) => number,
  ) {
    if (this._isMissingProps(...requiredProps)) {
      return false;
    }
    const propsForCalculation = requiredProps.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: this._state[curr]!,
      }),
      {} as CalculationInput,
    );
    const nextValue = calculate(propsForCalculation);
    return this._doStateUpdateIfChanged(prop, nextValue);
  }

  private _updateCurrentSongTimeFraction() {
    return this._updateDerivedStateProp(
      "current_song_time_fraction",
      ["current_song_time"],
      ({ current_song_time }) =>
        Math.floor(current_song_time / lampStateResolution),
    );
  }

  private _updateCtqBeats() {
    return this._updateDerivedStateProp(
      "ctq_beats",
      [
        "clip_trigger_quantization",
        "signature_denominator",
        "signature_numerator",
      ],
      ({
        clip_trigger_quantization,
        signature_denominator,
        signature_numerator,
      }: CalculationInput) =>
        convertClipTriggerQuantisationToBeats(
          clip_trigger_quantization,
          signature_numerator,
          signature_denominator,
        ),
    );
  }
  private _updateCtqFractions() {
    return this._updateDerivedStateProp(
      "ctq_fractions",
      [
        "clip_trigger_quantization",
        "signature_denominator",
        "signature_numerator",
      ],
      ({
        clip_trigger_quantization,
        signature_denominator,
        signature_numerator,
      }: CalculationInput) =>
        convertClipTriggerQuantisationToBeats(
          clip_trigger_quantization,
          signature_numerator,
          signature_denominator,
        ) / lampStateResolution,
    );
  }

  private _updateLampState() {
    return this._updateDerivedStateProp(
      "lamp_state",
      ["current_song_time"],
      ({ current_song_time }) => {
        const currentLampState = this._state.lamp_state;
        const remainder = current_song_time * lampStateResolution;
        const shouldChange = Math.abs(remainder) < Number.EPSILON * 10;
        log(
          `current song time = ${current_song_time} - should change? ${shouldChange}`,
        );
        if (!shouldChange) {
          return currentLampState || 0;
        }
        if (currentLampState === null || currentLampState === 0) {
          return 1;
        }
        return 0;
      },
    );
  }

  private _updateElapsedQuantisationSpans() {
    return this._updateDerivedStateProp(
      "elapsed_quantization_spans",
      ["ctq_beats", "current_song_time"],
      ({ ctq_beats, current_song_time }) =>
        Math.floor(current_song_time / ctq_beats),
    );
  }

  private _updateCurrentBeatInSpan() {
    return this._updateDerivedStateProp(
      "current_beat_in_span",
      ["elapsed_quantization_spans", "ctq_beats", "current_song_time"],
      ({ elapsed_quantization_spans, ctq_beats, current_song_time }) =>
        Math.floor(current_song_time - elapsed_quantization_spans * ctq_beats),
    );
  }

  private _updateCurrentFractionInSpan() {
    return this._updateDerivedStateProp(
      "current_fraction_in_span",
      ["elapsed_quantization_spans", "ctq_fractions", "current_song_time"],
      ({ elapsed_quantization_spans, ctq_fractions, current_song_time }) =>
        Math.floor(
          current_song_time / ctq_fractions - elapsed_quantization_spans,
        ),
    );
  }

  private _updateCurrentLamp() {
    return this._updateDerivedStateProp(
      "current_lamp",
      ["ctq_beats", "current_beat_in_span"],
      ({ ctq_beats, current_beat_in_span }) => {
        const beatsPerLamp = ctq_beats / numberOfLamps;
        return Math.floor(current_beat_in_span / beatsPerLamp);
      },
    );
  }

  private _isMissingProps(...props: StateProp[]) {
    return props.some((prop) => this._state[prop] === null);
  }

  private _doStateUpdateIfChanged(prop: StateProp, nextValue: number) {
    if (nextValue !== this._state[prop]) {
      this._state[prop] = nextValue;
      this._maybeLogStateChange(prop);
      return true;
    }
    return false;
  }

  private _maybeLogStateChange(prop: StateProp) {
    if (!loggedStateProps.includes(prop)) {
      return;
    }
    log(`state.${prop} = ${this._state[prop]}`);
  }

  private _sendLampMidiMessage() {
    for (let lampIndex = 0; lampIndex < 8; lampIndex++) {
      const colourIndex =
        lampIndex <= this._state.current_lamp!
          ? lampColours[lampIndex].on
          : lampColours[lampIndex].off;
      const lampPosition = lampIndex * 10 + 19;
      outlet(0, [144, lampPosition, colourIndex]);
    }
  }
}

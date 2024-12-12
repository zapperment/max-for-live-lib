import "core-js/actual/array/includes";
import type { State, StateProp, CalculationInput } from "../types";
import {
  ApiManager,
  convertClipTriggerQuantisationToBeats,
  log,
} from "../../../util";
import { loggedStateProps, numberOfLamps } from "../config";

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
    ctq_beats: null,
    elapsed_quantization_spans: null,
    current_beat_in_span: null,
    current_lamp: null,
  };

  private _apiMan = new ApiManager();

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
      this._doStateUpdateIfChanged(prop, nextValue);
      this._updateDerivedState();
    });
  }

  private _updateDerivedState() {
    this._updateCtqBeats();
    this._updateElapsedQuantisationSpans();
    this._updateCurrentBeatInSpan();
    this._updateCurrentLamp();
  }

  private _updateDerivedStateProp(
    prop: StateProp,
    requiredProps: StateProp[],
    calculate: (props: CalculationInput) => number,
  ) {
    if (this._isMissingProps(...requiredProps)) {
      return;
    }
    const propsForCalculation = requiredProps.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: this._state[curr]!,
      }),
      {} as CalculationInput,
    );
    const nextValue = calculate(propsForCalculation);
    this._doStateUpdateIfChanged(prop, nextValue);
  }

  private _updateCtqBeats() {
    this._updateDerivedStateProp(
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

  private _updateElapsedQuantisationSpans() {
    this._updateDerivedStateProp(
      "elapsed_quantization_spans",
      ["ctq_beats", "current_song_time"],
      ({ ctq_beats, current_song_time }) =>
        Math.floor(current_song_time / ctq_beats),
    );
  }

  private _updateCurrentBeatInSpan() {
    this._updateDerivedStateProp(
      "current_beat_in_span",
      ["elapsed_quantization_spans", "ctq_beats", "current_song_time"],
      ({ elapsed_quantization_spans, ctq_beats, current_song_time }) =>
        Math.floor(current_song_time - elapsed_quantization_spans * ctq_beats),
    );
  }

  private _updateCurrentLamp() {
    this._updateDerivedStateProp(
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
    log(`>> state.${prop} = ${this._state[prop]}`);
  }
}

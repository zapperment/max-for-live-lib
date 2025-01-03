import "core-js/actual/array/includes";
import type { State, StateProp, CalculationInput } from "../types";
import { ApiManager, mt, log } from "../../../util";
import { loggedStateProps, numberOfLamps, lampColours } from "../config";

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
    is_active: null,
    current_song_time: null,
    ctq_beats: null,
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
      this._doStateUpdateIfChanged(prop, nextValue);
      this._updateDerivedState();
    });
  }

  private _updateDerivedState() {
    const isActiveHasChanged = this._updateIsActive();

    if (isActiveHasChanged && this._state.is_active === 0) {
      // if quantisation is “None”, it makes no sense to have beat lamps on
      this._sendAllLampsOffMidiMessage();
      return;
    }

    this._updateCtqBeats();
    const currentLampHasChanged = this._updateCurrentLamp();

    if (currentLampHasChanged) {
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

  private _updateIsActive() {
    return this._updateDerivedStateProp(
      "is_active",
      ["clip_trigger_quantization"],
      ({ clip_trigger_quantization }) =>
        clip_trigger_quantization > 0 ? 1 : 0,
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
        mt.beatsForCTQ(
          clip_trigger_quantization,
          signature_numerator,
          signature_denominator,
        )!, // we know this can't be null because clip_trigger_quantization is validated previously
    );
  }

  private _updateCurrentLamp() {
    return this._updateDerivedStateProp(
      "current_lamp",
      ["ctq_beats", "current_song_time"],
      ({ ctq_beats, current_song_time }) => {
        const elapsedQuantisationCycles = Math.floor(
          current_song_time / ctq_beats,
        );
        const currentBeatInSpan =
          current_song_time - elapsedQuantisationCycles * ctq_beats;
        const beatsPerLamp = ctq_beats / numberOfLamps;
        return Math.floor(currentBeatInSpan / beatsPerLamp);
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

  private _sendAllLampsOffMidiMessage() {
    for (let lampIndex = 0; lampIndex < 8; lampIndex++) {
      const lampPosition = lampIndex * 10 + 19;
      outlet(0, [176, lampPosition, 0]);
      outlet(lampIndex + 1, 0);
    }
  }

  // send MIDI message to Launchpad Pro MK3 to light the lamps
  // on the scene trigger buttons on the right
  private _sendLampMidiMessage() {
    for (let lampIndex = 0; lampIndex < 8; lampIndex++) {
      const isOn = lampIndex <= this._state.current_lamp!;
      const colourIndex = isOn ? lampColours[lampIndex] : 0;
      const lampPosition = lampIndex * 10 + 19;
      outlet(0, [176, lampPosition, colourIndex]);
      outlet(lampIndex + 1, isOn ? 1 : 0);
    }
  }
}

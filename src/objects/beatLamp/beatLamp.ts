import "core-js/actual/array/includes";

import {
  ApiManager,
  log,
  convertClipTriggerQuantisationToBeats,
} from "../../util";

autowatch = 1;
inlets = 1;
outlets = 0;

interface State {
  clip_trigger_quantization: null | number;
  signature_numerator: null | number;
  signature_denominator: null | number;
  is_playing: null | number;
  current_song_time: null | number;
  ctq_beats: null | number;
  elapsed_quantization_spans: null | number;
  current_beat_in_span: null | number;
  current_lamp: null | number;
}

type StateProp = keyof State;

type CalculationInput = Record<StateProp, number>;

const state: State = {
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

const observedLiveSetProps: StateProp[] = [
  "clip_trigger_quantization",
  "signature_numerator",
  "signature_denominator",
  "is_playing",
  "current_song_time",
];

const loggedStateProps: StateProp[] = [
  "clip_trigger_quantization",
  "signature_numerator",
  "signature_denominator",
  "is_playing",
  "ctq_beats",
  "elapsed_quantization_spans",
  "current_beat_in_span",
  "current_lamp",
];

const apiMan = new ApiManager();

const numberOfLamps = 8;

export function start() {
  if (apiMan.hasNoApis) {
    observedLiveSetProps.forEach(observeLiveSet);
  }
  apiMan.start();
}

export function stop() {
  apiMan.stop();
}

function observeLiveSet(prop: StateProp) {
  observeState("live_set", prop);
}

function observeState(path: string, prop: StateProp) {
  apiMan.make(`${path} ${prop}`, (nextValue) => {
    doStateUpdateIfChanged(prop, nextValue);
    updateDerivedState();
  });
}

function updateDerivedState() {
  updateCtqBeats();
  updateElapsedQuantisationSpans();
  updateCurrentBeatInSpan();
  updateCurrentLamp();
}

function updateDerivedStateProp(
  prop: StateProp,
  requiredProps: StateProp[],
  calculate: (props: CalculationInput) => number,
) {
  if (isMissingProps(...requiredProps)) {
    return;
  }
  const propsForCalculation = requiredProps.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: state[curr]!,
    }),
    {} as CalculationInput,
  );
  const nextValue = calculate(propsForCalculation);
  doStateUpdateIfChanged(prop, nextValue);
}

function updateCtqBeats() {
  updateDerivedStateProp(
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

function updateCtqBeatsOrig() {
  if (
    isMissingProps(
      "clip_trigger_quantization",
      "signature_denominator",
      "signature_numerator",
    )
  ) {
    return;
  }
  const nextValue = convertClipTriggerQuantisationToBeats(
    state.clip_trigger_quantization!,
    state.signature_numerator!,
    state.signature_denominator!,
  );
  doStateUpdateIfChanged("ctq_beats", nextValue);
}

function updateElapsedQuantisationSpans() {
  if (isMissingProps("ctq_beats", "current_song_time")) {
    return;
  }
  const nextValue = Math.floor(state.current_song_time! / state.ctq_beats!);
  doStateUpdateIfChanged("elapsed_quantization_spans", nextValue);
}

function updateCurrentBeatInSpan() {
  if (
    isMissingProps(
      "elapsed_quantization_spans",
      "ctq_beats",
      "current_song_time",
    )
  ) {
    return;
  }
  const nextValue = Math.floor(
    state.current_song_time! -
      state.elapsed_quantization_spans! * state.ctq_beats!,
  );
  doStateUpdateIfChanged("current_beat_in_span", nextValue);
}

function updateCurrentLamp() {
  if (isMissingProps("ctq_beats", "current_beat_in_span")) {
    return;
  }
  const beatsPerLamp = state.ctq_beats! / numberOfLamps;
  const nextValue = Math.floor(state.current_beat_in_span! / beatsPerLamp);
  doStateUpdateIfChanged("current_lamp", nextValue);
}

function isMissingProps(...props: StateProp[]) {
  return props.some((prop) => state[prop] === null);
}

function doStateUpdateIfChanged(prop: StateProp, nextValue: number) {
  if (nextValue !== state[prop]) {
    state[prop] = nextValue;
    maybeLogStateChange(prop);
  }
}

function maybeLogStateChange(prop: StateProp) {
  if (!loggedStateProps.includes(prop)) {
    return;
  }
  log(`!!! state.${prop} = ${state[prop]}`);
}

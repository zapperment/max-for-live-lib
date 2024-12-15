import type { StateProp } from "./types";

export const numberOfLamps = 8;

//export const lampStateResolution = 0.0625;
export const lampStateResolution = 0.25;

export const loggedStateProps: StateProp[] = [
  "clip_trigger_quantization",
  "signature_numerator",
  "signature_denominator",
  "is_playing",
  "lamp_state",
  "ctq_beats",
  "ctq_fractions",
  "elapsed_quantization_spans",
  "current_beat_in_span",
  "current_fraction_in_span",
  // "current_song_time",
  //"current_song_time_fraction",
  "current_lamp",
];

export const lampColours = [
  { on: 21, off: 23 },
  { on: 21, off: 23 },
  { on: 21, off: 23 },
  { on: 21, off: 23 },
  { on: 21, off: 23 },
  { on: 13, off: 15 },
  { on: 13, off: 15 },
  { on: 5, off: 7 },
];

export interface State {
  is_active: null | number;
  clip_trigger_quantization: null | number;
  signature_numerator: null | number;
  signature_denominator: null | number;
  is_playing: null | number;
  current_song_time: null | number;
  ctq_beats: null | number;
  current_lamp: null | number;
}

export type StateProp = keyof State;

export type CalculationInput = Record<StateProp, number>;

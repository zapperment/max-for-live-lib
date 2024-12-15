export interface State {
  clip_trigger_quantization: null | number;
  signature_numerator: null | number;
  signature_denominator: null | number;
  is_playing: null | number;
  lamp_state: null | number;
  current_song_time: null | number;
  current_song_time_fraction: null | number;
  ctq_beats: null | number;
  ctq_fractions: null | number;
  elapsed_quantization_spans: null | number;
  current_beat_in_span: null | number;
  current_fraction_in_span: null | number;
  current_lamp: null | number;
}

export type StateProp = keyof State;

export type CalculationInput = Record<StateProp, number>;

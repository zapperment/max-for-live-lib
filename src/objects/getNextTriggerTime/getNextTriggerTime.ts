import { getNumberProperty, mt, log } from "../../util";

autowatch = 1;
inlets = 1;
outlets = 1;
setinletassist(0, "Bang: get the next trigger time");
setoutletassist(0, "Number: the next trigger time");

export function bang() {
  const clipTriggerQuantisation = getNumberProperty(
    "live_set clip_trigger_quantization",
  );
  const signatureNumerator = getNumberProperty("live_set signature_numerator");
  const signatureDenominator = getNumberProperty(
    "live_set signature_denominator",
  );
  const clipTriggerQuantisationInBeats = mt.beatsForLQ(
    clipTriggerQuantisation,
    signatureNumerator,
    signatureDenominator,
  );
  if (clipTriggerQuantisationInBeats === null) {
    return;
  }
  const currentSongTime = getNumberProperty("live_set current_song_time");
  const elapsedQuantisationSpans = Math.floor(
    currentSongTime / clipTriggerQuantisationInBeats,
  );
  outlet(
    0,
    elapsedQuantisationSpans * clipTriggerQuantisationInBeats +
      clipTriggerQuantisationInBeats,
  );
}

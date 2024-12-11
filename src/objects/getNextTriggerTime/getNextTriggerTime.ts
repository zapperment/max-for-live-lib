import { getNumberProperty, log } from "../../util";
import { convertClipTriggerQuantizationToBeats } from "./util";

autowatch = 1;
inlets = 1;
outlets = 1;
setinletassist(0, "Bang: get the next trigger time");
setoutletassist(0, "Number: the next trigger time");

export function bang() {
  const clipTriggerQuantization = getNumberProperty(
    "live_set clip_trigger_quantization",
  );
  const signatureNumerator = getNumberProperty("live_set signature_numerator");
  const signatureDenominator = getNumberProperty(
    "live_set signature_denominator",
  );
  const clipTriggerQuantizationInBeats = convertClipTriggerQuantizationToBeats(
    clipTriggerQuantization,
    signatureNumerator,
    signatureDenominator,
  );
  const currentSongTime = getNumberProperty("live_set current_song_time");
  log("current song time", currentSongTime);
  const elapsedQuantizationSpans = Math.floor(
    currentSongTime / clipTriggerQuantizationInBeats,
  );
  outlet(
    0,
    elapsedQuantizationSpans * clipTriggerQuantizationInBeats +
      clipTriggerQuantizationInBeats,
  );
}

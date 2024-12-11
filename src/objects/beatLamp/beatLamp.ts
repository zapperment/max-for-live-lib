import {
  ApiManager,
  log,
  convertClipTriggerQuantisationToBeats,
} from "../../util";

autowatch = 1;
inlets = 1;
outlets = 0;

const apiMan = new ApiManager();
let clipTriggerQuantisation: number;
let signatureNumerator: number;
let signatureDenominator: number;
let clipTriggerQuantisationInBeats: number;

export function bang() {
  apiMan
    .make(
      "live_set clip_trigger_quantization",
      (nextClipTriggerQuantisation) => {
        if (
          clipTriggerQuantisation !== undefined &&
          nextClipTriggerQuantisation === clipTriggerQuantisation
        ) {
          return;
        }
        clipTriggerQuantisation = nextClipTriggerQuantisation;
        log("Clip trigger quantisation:", clipTriggerQuantisation);
        updateClipTriggerQuantisationInBeats();
      },
    )
    .start();

  apiMan
    .make("live_set signature_numerator", (nextSignatureNumerator) => {
      if (
        signatureNumerator !== undefined &&
        nextSignatureNumerator === signatureNumerator
      ) {
        return;
      }
      signatureNumerator = nextSignatureNumerator;
      log("Signature numerator:", signatureNumerator);
      updateClipTriggerQuantisationInBeats();
    })
    .start();
  apiMan

    .make("live_set signature_denominator", (nextSignatureDenominator) => {
      if (
        signatureDenominator !== undefined &&
        nextSignatureDenominator === signatureDenominator
      ) {
        return;
      }
      signatureDenominator = nextSignatureDenominator;
      log("Signature denominator:", signatureDenominator);
      updateClipTriggerQuantisationInBeats();
    })
    .start();
}

function updateClipTriggerQuantisationInBeats() {
  if (
    clipTriggerQuantisation === undefined ||
    signatureNumerator === undefined ||
    signatureDenominator === undefined
  ) {
    return;
  }
  clipTriggerQuantisationInBeats = convertClipTriggerQuantisationToBeats(
    clipTriggerQuantisation,
    signatureNumerator,
    signatureDenominator,
  );
  log("Clip trigger quantisation in beats:", clipTriggerQuantisationInBeats);
}

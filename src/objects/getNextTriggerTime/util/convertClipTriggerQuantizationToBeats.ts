import calculateBeatsPerBar from "./calculateBeatsPerBar";

export default function (
  clipTriggerQuantization: number,
  signatureNumerator: number,
  signatureDenominator: number
) {
  const beatsPerBar = calculateBeatsPerBar(
    signatureNumerator,
    signatureDenominator
  );
  switch (clipTriggerQuantization) {
    // 0 = None
    case 0:
      return 0;
    // 1 = 8 Bars
    case 1:
      return beatsPerBar * 8;
    // 2 = 4 Bars
    case 2:
      return beatsPerBar * 4;
    // 3 = 2 Bars
    case 3:
      return beatsPerBar * 2;
    // 4 = 1 Bar
    case 4:
      return beatsPerBar;
    // 5 = 1/2
    case 5:
      return 2;
    // 6 = 1/2T
    case 6:
      return 4 / 3;
    // 7 = 1/4
    case 7:
      return 1;
    // 8 = 1/4T
    case 8:
      return 2 / 3;
    // 9 = 1/8
    case 9:
      return 0.5;
    // 10 = 1/8T
    case 10:
      return 1 / 3;
    // 11 = 1/16
    case 11:
      return 0.25;
    // 12 = 1/16T
    case 12:
      return 0.5 / 3;
    // 13 = 1/32
    case 13:
      return 0.125;
    default:
      throw new Error(
        `Invalid clip trigger quantization: ${clipTriggerQuantization}`
      );
  }
}

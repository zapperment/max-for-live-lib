export default function calculateBeatsPerBar(
  signatureNumerator: number,
  signatureDenominator: number
) {
  switch (signatureDenominator) {
    case 1:
      return signatureNumerator * 4;
    case 2:
      return signatureNumerator * 2;
    case 4:
      return signatureNumerator;
    case 8:
      return signatureNumerator / 2;
    case 16:
      return signatureNumerator / 4;
    default:
      throw new Error(
        `Invalid time signature denominator: ${signatureDenominator}`
      );
  }
}
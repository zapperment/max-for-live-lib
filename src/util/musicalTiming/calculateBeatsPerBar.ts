/**
 * Calculates the number of beats in one bar. A “beat” in Ableton Live lingo is
 * synonymous with a crotchet (quarter note).
 *
 * @param signatureNumerator - The numerator of the time signature, e.g. 6 for
 *   6/8 time
 * @param signatureDenominator - The denominator of the time signature, e.g. 8
 *   for 6/8 time.
 * @returns The number of beats per bar
 * @name calculateBeatsPerBar
 */
export default (signatureNumerator: number, signatureDenominator: number) =>
  (4 / signatureDenominator) * signatureNumerator;

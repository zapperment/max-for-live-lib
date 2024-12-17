import beatsPerBar from "./beatsPerBar";
import barsForCTQ from "./barsForCTQ";

/**
 * Returns the number of beats for a given clip trigger quantisation mode. A
 * beat is a crotchet (quarter note).
 *
 * @param ctqIndex - The index of the Ableton Live clip trigger quantisation
 *   mode
 * @param tsNum - The numerator of the time signature, e.g. 6 for 6/8 time
 * @param tsDen - The denominator of the time signature, e.g. 8 for 6/8 time.
 * @returns The number of beats
 * @name beatsForCTQ
 */
export default (ctqIndex: number, tsNum: number, tsDen: number) => {
  const b4ctq = barsForCTQ(ctqIndex, tsNum, tsDen);
  if (b4ctq === null) {
    return null;
  }
  const bpb = beatsPerBar(tsNum, tsDen);
  return b4ctq * bpb;
};

import beatsPerBar from "./beatsPerBar";
import barsForLQ from "./barsForLQ";

/**
 * Returns the number of beats for a given launch quantisation mode. A beat is a
 * crotched (quarter note).
 *
 * @param lqIndex - The index of the Ableton Live launch quantisation mode
 * @param tsNum - The numerator of the time signature, e.g. 6 for 6/8 time
 * @param tsDen - The denominator of the time signature, e.g. 8 for 6/8 time.
 * @returns The number of beats
 * @name beatsForLQ
 */
export default (lqIndex: number, tsNum: number, tsDen: number) => {
  const b4lq = barsForLQ(lqIndex, tsNum, tsDen);
  if (b4lq === null) {
    return null;
  }
  const bpb = beatsPerBar(tsNum, tsDen);
  return b4lq * bpb;
  // switch (lqIndex) {
  //   // 0 = None
  //   case 0:
  //     return null;

  //   // 1 = 8 Bars
  //   case 1:
  //     return bpb * 8;

  //   // 2 = 4 Bars
  //   case 2:
  //     return bpb * 4;

  //   // 3 = 2 Bars
  //   case 3:
  //     return bpb * 2;

  //   // 4 = 1 Bar
  //   case 4:
  //     return bpb;

  //   // 5 = 1/2
  //   case 5:
  //     return 2;

  //   // 6 = 1/2T
  //   case 6:
  //     return 4 / 3;

  //   // 7 = 1/4
  //   case 7:
  //     return 1;

  //   // 8 = 1/4T
  //   case 8:
  //     return 2 / 3;

  //   // 9 = 1/8
  //   case 9:
  //     return 1 / 2;

  //   // 10 = 1/8T
  //   case 10:
  //     return 1 / 3;

  //   // 11 = 1/16
  //   case 11:
  //     return 1 / 4;

  //   // 12 = 1/16T
  //   case 12:
  //     return 1 / 6;

  //   // 13 = 1/32
  //   case 13:
  //     return 1 / 8;

  //   default:
  //     throw new Error(`Invalid clip trigger quantisation: ${lqIndex}`);
  // }
};

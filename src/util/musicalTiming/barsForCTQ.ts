/**
 * Returns the number of bars for a given clip trigger quantisation and time
 * signature.
 *
 * @param ctqIndex - The index of the Ableton Live clip trigger quantisation
 *   mode
 * @param tsNum - The numerator of the time signature, e.g. 6 for 6/8 time
 * @param tsDen - The denominator of the time signature, e.g. 8 for 6/8 time.
 * @returns The number of bars
 * @name barsForCTQ
 */
export default (ctqIndex: number, tsNum: number, tsDen: number) => {
  const tsFraction = tsDen / tsNum;
  switch (ctqIndex) {
    // 0 = None
    case 0:
      return null;

    // 1 = 8 Bars
    case 1:
      return 8;

    // 2 = 4 Bars
    case 2:
      return 4;

    // 3 = 2 Bars
    case 3:
      return 2;

    // 4 = 1 Bar
    case 4:
      return 1;

    // 5 = 1/2
    case 5:
      return tsFraction / 2;

    // 6 = 1/2T
    case 6:
      return tsFraction / 3;

    // 7 = 1/4
    case 7:
      return tsFraction / 4;

    // 8 = 1/4T
    case 8:
      return tsFraction / 6;

    // 9 = 1/8
    case 9:
      return tsFraction / 8;

    // 10 = 1/8T
    case 10:
      return tsFraction / 12;

    // 11 = 1/16
    case 11:
      return tsFraction / 16;

    // 12 = 1/16T
    case 12:
      return tsFraction / 24;

    // 13 = 1/32
    case 13:
      return tsFraction / 32;

    default:
      throw new Error(`Invalid launch quantisation: ${ctqIndex}`);
  }
};

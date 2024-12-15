import barsForCTQ from "./barsForCTQ";

test.each`
  ctqName     | ctqIndex | tsName   | tsNumerator | tsDenominator | expected
  ${"None"}   | ${0}     | ${"4/4"} | ${4}        | ${4}          | ${null}
  ${"8 bars"} | ${1}     | ${"4/4"} | ${4}        | ${4}          | ${8}
  ${"4 bars"} | ${2}     | ${"4/4"} | ${4}        | ${4}          | ${4}
  ${"2 bars"} | ${3}     | ${"4/4"} | ${4}        | ${4}          | ${2}
  ${"1 bar"}  | ${4}     | ${"4/4"} | ${4}        | ${4}          | ${1}
  ${"1/2"}    | ${5}     | ${"4/4"} | ${4}        | ${4}          | ${1 / 2}
  ${"1/2T"}   | ${6}     | ${"4/4"} | ${4}        | ${4}          | ${1 / 3}
  ${"1/4"}    | ${7}     | ${"4/4"} | ${4}        | ${4}          | ${1 / 4}
  ${"1/4T"}   | ${8}     | ${"4/4"} | ${4}        | ${4}          | ${1 / 6}
  ${"1/8"}    | ${9}     | ${"4/4"} | ${4}        | ${4}          | ${1 / 8}
  ${"1/8T"}   | ${10}    | ${"4/4"} | ${4}        | ${4}          | ${1 / 12}
  ${"1/16"}   | ${11}    | ${"4/4"} | ${4}        | ${4}          | ${1 / 16}
  ${"1/16T"}  | ${12}    | ${"4/4"} | ${4}        | ${4}          | ${1 / 24}
  ${"1/32"}   | ${13}    | ${"4/4"} | ${4}        | ${4}          | ${1 / 32}
  ${"None"}   | ${0}     | ${"3/4"} | ${3}        | ${4}          | ${null}
  ${"8 bars"} | ${1}     | ${"3/4"} | ${3}        | ${4}          | ${8}
  ${"4 bars"} | ${2}     | ${"3/4"} | ${3}        | ${4}          | ${4}
  ${"2 bars"} | ${3}     | ${"3/4"} | ${3}        | ${4}          | ${2}
  ${"1 bar"}  | ${4}     | ${"3/4"} | ${3}        | ${4}          | ${1}
  ${"1/2"}    | ${5}     | ${"3/4"} | ${3}        | ${4}          | ${2 / 3}
  ${"1/2T"}   | ${6}     | ${"3/4"} | ${3}        | ${4}          | ${4 / 9}
  ${"1/4"}    | ${7}     | ${"3/4"} | ${3}        | ${4}          | ${1 / 3}
  ${"1/4T"}   | ${8}     | ${"3/4"} | ${3}        | ${4}          | ${2 / 9}
  ${"1/8"}    | ${9}     | ${"3/4"} | ${3}        | ${4}          | ${1 / 6}
  ${"1/8T"}   | ${10}    | ${"3/4"} | ${3}        | ${4}          | ${1 / 9}
  ${"1/16"}   | ${11}    | ${"3/4"} | ${3}        | ${4}          | ${1 / 12}
  ${"1/16T"}  | ${12}    | ${"3/4"} | ${3}        | ${4}          | ${1 / 18}
  ${"1/32"}   | ${13}    | ${"3/4"} | ${3}        | ${4}          | ${1 / 24}
`(
  "given clip trigger quantisation $ctqName and time signature $tsName, returns $expected",
  ({ ctqIndex, tsNumerator, tsDenominator, expected }) => {
    expect(barsForCTQ(ctqIndex, tsNumerator, tsDenominator)).toBe(expected);
  },
);

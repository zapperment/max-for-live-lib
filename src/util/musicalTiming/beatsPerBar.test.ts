import beatsPerBar from "./beatsPerBar";

test.each`
  tsName   | tsNumerator | tsDenominator | expected
  ${"4/4"} | ${4}        | ${4}          | ${4}
  ${"3/4"} | ${3}        | ${4}          | ${3}
  ${"2/4"} | ${2}        | ${4}          | ${2}
  ${"6/8"} | ${6}        | ${8}          | ${3}
  ${"5/4"} | ${5}        | ${4}          | ${5}
  ${"7/8"} | ${7}        | ${8}          | ${3.5}
`(
  "given a $tsName time signature, returns $expected",
  ({ tsNumerator, tsDenominator, expected }) => {
    expect(beatsPerBar(tsNumerator, tsDenominator)).toBe(expected);
  },
);

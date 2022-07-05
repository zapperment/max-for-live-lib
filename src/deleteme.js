function calculateBeatsPerBar(signatureNumerator, signatureDenominator) {
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
  }
}

function calculateBeatsPerBar2(signatureNumerator, signatureDenominator) {
  return signatureNumerator * (signatureDenominator / 4);
}

console.log("4/4:", calculateBeatsPerBar(4, 4));
console.log("3/4:", calculateBeatsPerBar(3, 4));
console.log("5/4:", calculateBeatsPerBar(5, 4));
console.log("6/8:", calculateBeatsPerBar(6, 8));
console.log("4/4:", calculateBeatsPerBar2(4, 4));
console.log("3/4:", calculateBeatsPerBar2(3, 4));
console.log("5/4:", calculateBeatsPerBar2(5, 4));
console.log("6/8:", calculateBeatsPerBar2(6, 8));

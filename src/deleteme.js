const furz = ["id", 1, "id", 2];
const clipSlotIds = furz.reduce(
  (acc, curr) => {
    if (typeof curr === "string") {
      acc.push([curr]);
    } else {
      acc[acc.length - 1].push(curr);
    }
    return acc;
  },
  []
);
console.log(clipSlotIds);

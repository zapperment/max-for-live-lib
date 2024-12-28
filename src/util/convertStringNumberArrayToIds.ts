export default function convertStringNumberArrayToIds(input: string[]): Id[] {
  return input
    .reduce(
      (acc: Id[], curr: string) =>
        curr === "id" ? acc : [...acc, ["id", curr] as Id],
      [] as Id[],
    )
    .filter((id: Id) => id[1] !== "0");
}

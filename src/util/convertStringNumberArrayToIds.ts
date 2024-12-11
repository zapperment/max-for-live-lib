export default function convertStringNumberArrayToIds(
  input: (string | number)[]
): Id[] {
  return input.reduce(
    (acc: Id[], curr: string | number) =>
      curr === "id" ? acc : [...acc, ["id", curr] as Id],
    [] as Id[]
  ).filter((id:Id)=> id[1] !== 0);
}

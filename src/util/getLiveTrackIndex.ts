/**
 * Gets the index of the Live track that the current Max device lives in
 */
export default function getLiveTrackIndex(): number {
  const api = new LiveAPI("this_device");
  const matches = api.path.match(/tracks (\d+)/);
  if (matches === null || matches.length < 1) {
    throw new Error("Expected to get a path containing “tracks”, got no match");
  }
  return parseInt(matches[1], 10);
}

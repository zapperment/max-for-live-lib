const lampStateResolution = 0.25;

function isOnGrid(current_song_time) {
  // Calculate the remainder when dividing current_song_time by lampStateResolution
  const remainder = current_song_time % lampStateResolution;

  // If the remainder is 0 (or close enough to 0 within a small tolerance for floating-point precision), return true
  return Math.abs(remainder) < Number.EPSILON * 10;
}

for (
  let current_song_time = 0;
  current_song_time < 1;
  current_song_time += 0.01
) {
  console.log(current_song_time, isOnGrid(current_song_time));
}

const current_song_time = 0.5;
console.log(current_song_time, isOnGrid(current_song_time));

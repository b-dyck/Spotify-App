/**
 * Format milliseconds to time duration
 * @param {number} ms number of milliseconds
 * @returns {string} formatted duration string
 * @example 216699 -> '3:36'
 */
export const formatDuration = ms => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(((ms % 60000) / 1000));
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

/**
 * Select 2 artists from spotify getTopArtists api
 * https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 */
export const chooseTwoArtists = artists => {
  const arr = [];
  let index = 0;
  if (artists.items && artists.items.length > 1) {
    index = Math.floor(Math.random() * (artists.items.length - 1));
    arr[0] = artists.items[index];
    arr[1] = artists.items[index+1];
  }
  return arr;
}
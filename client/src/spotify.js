import axios from 'axios';

//Map for local storage keys
const LOCALSTORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expireTime: 'sotify_token_expiry_time',
    timeStamp: 'spotify_token_timestamp',
}

//Map to retrieve local storage values

const LOCALSTORAGE_VALUES = {
    accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timeStamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timeStamp),
}

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
    // Clear all localStorage items
    for (const property in LOCALSTORAGE_KEYS) {
      window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }
    // Navigate to homepage
    window.location = window.location.origin;
  };

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
const refreshToken = async () => {
    try {
      // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
      if (!LOCALSTORAGE_VALUES.refreshToken ||
        LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
        (Date.now() - Number(LOCALSTORAGE_VALUES.timeStamp)) < 1000
      ) {
        console.error('No refresh token available');
        logout();
      }
  
      // Use `/refresh_token` endpoint from our Node app
      const { data } = await axios.get(`/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);
  
      // Update localStorage values
      window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
      window.localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());
  
      // Reload the page for localStorage updates to be reflected
      window.location.reload();
  
    } catch (e) {
      console.error(e);
    }
  };

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
const hasTokenExpired = () => {
    const { accessToken, timeStamp, expireTime } = LOCALSTORAGE_VALUES;
    if (!accessToken || !timeStamp) {
      return false;
    }
    const millisecondsElapsed = Date.now() - Number(timeStamp);
    return (millisecondsElapsed / 1000) > Number(expireTime);
  };


/**
 * Handles logic for retrieving the Spotify access token from localStorage
 * or URL query params
 * @returns {string} A Spotify access token
 */
const getAccessToken = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams = {
      [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
      [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
      [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
    };
    const hasError = urlParams.get('error');
  
    // If there's an error OR the token in localStorage has expired, refresh the token
    if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 'undefined') {
      refreshToken();
    }
  
    // If there is a valid access token in localStorage, use that
    if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
      return LOCALSTORAGE_VALUES.accessToken;
    }
  
    // If there is a token in the URL query params, user is logging in for the first time
    if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
      // Store the query params in localStorage
      for (const property in queryParams) {
        window.localStorage.setItem(property, queryParams[property]);
      }
      // Set timestamp
      window.localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());
      // Return access token from query params
      return queryParams[LOCALSTORAGE_KEYS.accessToken];
    }
  
    // We should never get here!
    return false;
  };

export const accessToken = getAccessToken();

/**
 * Axios global request headers
 * https://github.com/axios/axios#global-axios-defaults
 */
axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-Type'] = 'application/json';

/**
 * Get Current Users Profile
 * https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
 * @returns {Promise}
 */
export const getCurrentUserProfile = () => axios.get('/me');

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-list-of-current-users-playlists
 * @returns {Promise}
 */
export const getCurrentUserPlaylists = (limit = 20) => {
  return axios.get(`/me/playlists?limit=${limit}`);
};

/**
 * Get a List of Current User's Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 * @returns {Promise}
 */
export const getCurrentUserTopArtists = (limit = 10, time_range = 'short_term') => {
  return axios.get(`/me/top/artists?limit=${limit}&time_range=${time_range}`);
}

/**
 * Get a List of Current User's Top Tracks
 *  * https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 * @returns {Promise}
 */
export const getCurrentUserTopTracks = (limit = 10, time_range = 'short_term') => {
  return axios.get(`/me/top/tracks?limit=${limit}&time_range=${time_range}`);
}

/**
 * Get a list of related artists of given artist
 * https://developer.spotify.com/documentation/web-api/reference/get-an-artists-related-artists
 * @returns {Promise}
 */
export const getRelatedArtists = (id) => {
  return axios.get(`/artists/${id}/related-artists`);
}

/**
 * Get artist by ID
 * https://developer.spotify.com/documentation/web-api/reference/get-an-artist
 * @returns {Promise}
 */
export const getArtist = (id) => {
  return axios.get(`/artists/${id}`);
}
//contain most of the logic for fetching the data from each API endpoint
/*
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API
  let url = 'https://api.ipify.org?format=json';
  request(url, (error, response, body) => {
    if (error) return callback(error, null);//error can be from invalid domain, user is offline etc.
    if (response.statusCode !== 200) {//if non-200 status, assume server error
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
}
//takes in an IP and return latitude(horizontal) and longitude(vertical)
const fetchCoordsByIP = function(ip, callback) {
  let url = `https://api.ipgeolocationapi.com/geolocate/${ip}`
  request(url, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coords. Response: ${body}`;
      return callback(Error(msg), null);
    }
    const {latitude,longitude} = JSON.parse(body).geo;
    callback(null, {latitude,longitude});
  });
};
const fetchISSFlyOverTimes = function(coords, callback) {
  let url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times:${body}`;
      return callback(Error(msg), null);
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
}
const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => { 
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error,loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, nextPasses);
      });
    });
  });
};
module.exports = { nextISSTimesForMyLocation };


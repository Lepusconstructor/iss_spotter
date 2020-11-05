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
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    return callback(null, ip);
  })
}

module.exports = { fetchMyIP };
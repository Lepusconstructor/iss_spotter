const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('http://api.ipify.org?format=json');
}; 

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://api.ipgeolocationapi.com/geolocate/${ip}`);
}

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body).geo;
  let url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
  return request(url);
}

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((geo) => {
      const { response } = JSON.parse(geo);
      return response;
    });
};
module.exports = { nextISSTimesForMyLocation };
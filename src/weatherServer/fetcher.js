const { URL } = require('url');
const querystring = require('querystring');

const axios = require('axios');

const config = require('./config');

async function getWeather({ location }) {
  const APPID = config.openWeatherMapAPIKey;
  const query = querystring.stringify({
    q: location,
    units: 'metric',
    APPID,
  });

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.search = query;

  const { data } = await axios
    .get(url.toString());

  const {
    coord: {
      lat,
      lon,
    },
    main: {
      humidity,
      temp,
      pressure,
    },
    name,
  } = data;

  return {
    lat,
    lon,
    location: name,
    humidity,
    pressure,
    temp,
  };
}

module.exports = {
  getWeather,
};

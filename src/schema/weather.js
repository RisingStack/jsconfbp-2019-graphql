const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const Weather = new GraphQLObjectType({
  name: 'Weather',
  fields: {
    lat: {
      type: GraphQLString,
      description: 'The latitude of the requested location',
    },
    lon: {
      type: GraphQLString,
      description: 'The longitute of the requested location',
    },
    temp: {
      type: GraphQLString,
      description: 'Temperature in Celsius degrees',
    },
    humidity: {
      type: GraphQLString,
      description: 'Humidity in %',
    },
    pressure: {
      type: GraphQLString,
      description: 'Atmospheric pressure in hPa',
    },
  },
});

module.exports = {
  Weather,
};

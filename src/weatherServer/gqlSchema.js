const { gql } = require('apollo-server');

const { getWeather } = require('./fetcher');

const typeDefs = gql`
  type Weather @key(fields: "location"){
    lat: String!
    lon: String!
    temp: String!
    humidity: String!
    pressure: String!
    location: String!
  }

  extend type Query {
    weather(location: String!): Weather
  }
`;

const resolvers = {
  Query: {
    weather(_, args) {
      return getWeather(args);
    },
  },
  Weather: {
    /* eslint-disable-next-line no-underscore-dangle */
    __resolveReference(weather) {
      return getWeather({ location: weather.location });
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};

const { gql } = require('apollo-server');

const { getWeather } = require('./fetcher');

// TODO (1) write the new weather schema
const typeDefs = gql`
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
  // TODO (2) resolve reference on the root level
};

module.exports = {
  typeDefs,
  resolvers,
};

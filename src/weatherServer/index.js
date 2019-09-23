const express = require('express');
const graphqlHTTP = require('express-graphql');
const helmet = require('helmet');
const cors = require('cors');
const { buildFederatedSchema } = require('@apollo/federation');

const db = require('./db');
const config = require('./config');

// Raw Graphql schema language - add rootValue from graphqlHTTP when used
const {
  typeDefs,
  resolvers,
} = require('./gqlSchema');

const app = express();

db.createTables();

app.use(helmet());

app.use(cors({
  origin: [/http:\/\/localhost:\d+$/],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/graphql', graphqlHTTP(async () => ({
  schema: buildFederatedSchema({
    typeDefs,
    resolvers,
  }),
  graphiql: true,
  customFormatErrorFn: (error) => {
    // eslint-disable-next-line no-console
    console.error(error); // Log Error here
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
    };
  },
})));

const port = Number(config.port) + 100;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Express GraphQL Server Is Listening on port ${port}`));

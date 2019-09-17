const express = require('express');
const graphqlHTTP = require('express-graphql');
const helmet = require('helmet');
const cors = require('cors');

const db = require('./db');
const schema = require('./schema');
const config = require('./config');

const app = express();

db.createTables();

app.use(helmet());

app.use(cors({
  origin: [/http:\/\/localhost:\d+$/],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/graphql', graphqlHTTP(async () => ({
  schema,
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

// eslint-disable-next-line no-console
app.listen(config.port, () => console.log(`Express GraphQL Server Is Listening on port ${config.port}`));

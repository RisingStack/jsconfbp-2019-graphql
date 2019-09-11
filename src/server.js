const express = require('express');
const graphqlHTTP = require('express-graphql');

const db = require('./db');
const schema = require('./schema');

const app = express();

db.createTables();

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
app.listen(8000, () => console.log('Express GraphQL Server Is Listening on port 8000'));

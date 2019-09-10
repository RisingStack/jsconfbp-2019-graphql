const express = require('express');
const graphqlHTTP = require('express-graphql');

const db = require('./db');
const schema = require('./schema');

const app = express();

db.createTables();

app.use('/graphql', graphqlHTTP(async () => ({
  schema,
  graphiql: true,
})));

// eslint-disable-next-line no-console
app.listen(8000, () => console.log('Express GraphQL Server Is Listening on port 8000'));

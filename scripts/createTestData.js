#!/usr/bin/env node
/* eslint-disable no-console */

require('dotenv/config');

const db = require('../src/server/db');

Promise.all(db.createTables()).then(() => {
  Promise.all(db.createTestData()).then(() => {
    console.log('Test data created.');
    process.exit(0);
  });
});

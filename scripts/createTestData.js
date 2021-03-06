#!/usr/bin/env node
/* eslint-disable no-console */

const db = require('../src/db');

Promise.all(db.createTables()).then(() => {
  Promise.all(db.createTestData()).then(() => {
    console.log('Test data created.');
    process.exit(0);
  });
});

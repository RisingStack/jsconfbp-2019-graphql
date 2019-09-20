#!/usr/bin/env node
/* eslint-disable no-console */

require('dotenv/config');

const db = require('../src/db');

Promise.all(db.dropTables()).then(() => {
  console.log('Tables dropped.');
  process.exit(0);
});

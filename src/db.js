const { Pool } = require('pg');

const config = require('./config.js');

const {
  user,
  password,
  database,
  host,
  port,
} = config.dbConnectionInfo;

const pool = new Pool({
  database,
  password,
  host,
  port,
  user,
});

const createTables = () => {
  const createTableQueries = [
    `CREATE TABLE IF NOT EXISTS users(
      id UUID PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      username VARCHAR(30) NOT NULL,
      email VARCHAR(30) NOT NULL UNIQUE,
      password_digest VARCHAR(100) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS posts(
      id UUID PRIMARY KEY,
      title VARCHAR(30) NOT NULL,
      description VARCHAR(100),
      content TEXT NOT NULL,
      author VARCHAR(30) NOT NULL,
      timestamp TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS comments(
      id UUID PRIMARY KEY,
      content TEXT NOT NULL,
      author VARCHAR(30) NOT NULL,
      post UUID NOT NULL,
      timestamp TIMESTAMP NOT NULL
    )`,
  ];

  createTableQueries.forEach((query) => pool.query(query));
};

const dropTables = () => {
  const dropTableQueries = [
    'DROP TABLE IF EXISTS users',
    'DROP TABLE IF EXISTS posts',
    'DROP TABLE IF EXISTS comments',
  ];

  dropTableQueries.forEach((query) => pool.query(query));
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  createTables,
  dropTables,
};

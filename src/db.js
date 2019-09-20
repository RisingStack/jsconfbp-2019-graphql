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

  return createTableQueries.map((query) => pool.query(query));
};

const dropTables = () => {
  const dropTableQueries = [
    'DROP TABLE IF EXISTS users',
    'DROP TABLE IF EXISTS posts',
    'DROP TABLE IF EXISTS comments',
  ];

  return dropTableQueries.map((query) => pool.query(query));
};

const createTestData = () => {
  // password for test user: password
  const testDataQueries = [
    `INSERT INTO users(id, name, username, email, password_digest)
    VALUES('8aaf37cf-94c9-4c6a-b566-0265ce34b58c', 'Tyler', 'tyler1337', 'tyler@risingstack.com', '$2b$10$yv9DxXTpvBmBYKu8rXoSIONn3BZB5/jQRDPMKt/YUAq8eTYoXGwKu')
    RETURNING *
    `,
    `INSERT INTO users(id, name, username, email, password_digest)
    VALUES('8aaf37cf-94c9-4c6a-b566-0265ce34b68c', 'Marla', 'marlaSinger', 'marla@risingstack.com', '$2b$10$yv9DxXTpvBmBYKu8rXoSIONn3BZB5/jQRDPMKt/YUAq8eTYoXGwKu')
    RETURNING *
    `,
    `INSERT INTO posts(id, title, description, content, author, timestamp)
    VALUES('8aaf37cf-94c9-4c6a-b566-0265ce34b78c', 'Test Post', 'This is my test post', 'Test post Content', 'tyler@risingstack.com', '2019-09-15T07:30:57.392Z')
    RETURNING *
    `,
    `INSERT INTO posts(id, title, description, content, author, timestamp)
    VALUES('8aaf37cf-94c9-4c6a-b566-0265ce34b58a', 'Test Post 2', 'This is my test post', 'Test post Content', 'tyler@risingstack.com', '2019-09-18T07:30:57.392Z')
    RETURNING *
    `,
    `INSERT INTO comments(id, content, author, post, timestamp)
    VALUES('8aaf37cf-94c9-4c6a-b566-0265ce34b88c', 'Test Comment', 'tyler@risingstack.com', '8aaf37cf-94c9-4c6a-b566-0265ce34b78c', '2019-09-15T08:30:57.392Z')
    RETURNING *
    `,
    `INSERT INTO comments(id, content, author, post, timestamp)
    VALUES('8aaf37cf-94c9-4c6a-b566-0265ce34b98c', 'Test Comment 2', 'marla@risingstack.com', '8aaf37cf-94c9-4c6a-b566-0265ce34b78c', '2019-09-16T07:30:57.392Z')
    RETURNING *
    `,
  ];

  return testDataQueries.map((query) => pool.query(query));
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  createTables,
  dropTables,
  createTestData,
};

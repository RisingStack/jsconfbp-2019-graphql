const bcrypt = require('bcrypt');
const { get } = require('lodash');
const uuid = require('uuidv4').default;

const db = require('./db');


const getPgQueries = ({ table, args }) => {
  const {
    order, limit, offset, filters,
  } = args;
  let query = `SELECT * FROM ${table}`;
  let countQuery = `SELECT COUNT(*) FROM ${table}`;
  let whereAdded = false;
  if (filters) {
    filters.forEach(({ field, value, operation }) => {
      let filter = null;
      if (whereAdded) {
        filter = ' AND ';
      } else {
        filter = ' WHERE ';
        whereAdded = true;
      }
      filter += `${field} ${operation} '${operation === 'LIKE' ? `%${value}%` : value}'`;
      query += filter;
      countQuery += filter;
    });
  }
  query += ` ORDER BY ${get(order, 'field', 'id')} ${get(order, 'direction', 'asc')}`;
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  if (offset) {
    query += ` OFFSET ${offset}`;
  }
  return {
    query,
    countQuery,
  };
};

const getHello = async () => {
  const { rows } = await db.query('SELECT $1::text as message', ['Hello world!']);
  return rows[0].message;
};

const resolveQuery = async ({ table, args }) => {
  const { query, countQuery } = getPgQueries({ table, args });
  const { rows } = await db.query(query);
  const { rows: countRows } = await db.query(countQuery);
  const totalRecords = get(countRows, '[0].count', 0);
  return {
    pageInfo: {
      hasNextPage: totalRecords > (get(args, 'offset', 0) + rows.length),
      hasPreviousPage: get(args, 'offset', 0) > 0,
      totalRecords,
    },
    edges: rows.map((row) => ({
      node: row,
    })),
  };
};

const comparePassword = (password, passwordDigest) => new Promise((resolve, reject) => (
  bcrypt.compare(password, passwordDigest, (err, response) => {
    if (err) {
      reject(err);
    } else if (response) {
      resolve(response);
    } else {
      reject(new Error('Password missmatch'));
    }
  })
));


const signin = async (args) => {
  const { email, password } = args;
  const { rows } = await db.query({
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  });
  const user = rows[0];
  await comparePassword(password, user.password_digest);
  delete user.password_digest;
  return user;
};

const hashPassword = (password) => new Promise((resolve, reject) => (
  bcrypt.hash(password, 10, (err, hash) => (err ? reject(err) : resolve(hash)))
));

const createUser = async (args) => {
  const {
    password, name, username, email,
  } = get(args, 'input', {});
  const hashedPassword = await hashPassword(password);
  const { rows } = await db.query({
    text: 'INSERT INTO users(id, name, username, email, password_digest) VALUES($1, $2, $3, $4, $5) RETURNING *',
    values: [uuid(), name, username, email, hashedPassword],
  });
  const user = rows[0];
  delete user.password_digest;
  return user;
};

const createPost = async (args) => {
  const {
    content, author, title, description,
  } = get(args, 'input', {});
  const { rows } = await db.query({
    text: 'INSERT INTO posts(id, title, description, content, author, timestamp) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
    values: [uuid(), title, description, content, author, new Date()],
  });
  return rows[0];
};

const createComment = async (args) => {
  const { content, author, post } = get(args, 'input', {});
  const { rows } = await db.query({
    text: 'INSERT INTO comments(id, content, author, post, timestamp) VALUES($1, $2, $3, $4, $5) RETURNING *',
    values: [uuid(), content, author, post, new Date()],
  });
  return rows[0];
};


// TODO fire a request to the open weather API to fetch the today's weather
// https://api.openweathermap.org/data/2.5/weather
// "config.openWeatherMapAPIKey" should contain your API key from the environment
// Make sure you only return items that you have declared in your schema!
function getWeather() {
  // eslint-disable-next-line no-console
  console.log('JS Conf Budapest 2019!');
}

module.exports = {
  createComment,
  createPost,
  createUser,
  getHello,
  getWeather,
  resolveQuery,
  signin,
};

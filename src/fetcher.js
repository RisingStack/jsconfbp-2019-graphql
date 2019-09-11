const uuid = require('uuidv4').default;
const { get } = require('lodash');
const db = require('./db');

/*
  TODO: OR operator filter schema rework ?
  TODO: after and cursors ?
  TODO: handle errors ?
*/

const getPgQueries = ({ table, args }) => {
  const {
    order, limit, offset, filters,
  } = args;
  let query = `SELECT * FROM ${table}`;
  let countQuery = `SELECT COUNT(*) FROM ${table}`;
  let whereAdded = false;
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

const createUser = async (args) => {
  const { input } = args;
  const query = {
    text: 'INSERT INTO users(id, name, username, email) VALUES($1, $2, $3, $4) RETURNING *',
    values: [uuid(), input.name, input.username, input.email],
  };
  const { rows } = await db.query(query);
  return { user: rows[0] };
};

const createPost = async (args) => {
  const { input } = args;
  const query = {
    text: 'INSERT INTO posts(id, content, author, timestamp) VALUES($1, $2, $3, $4) RETURNING *',
    values: [uuid(), input.content, input.author, new Date()],
  };
  const { rows } = await db.query(query);
  return { post: rows[0] };
};

const createComment = async (args) => {
  const { input } = args;
  const query = {
    text: 'INSERT INTO comments(id, content, author, post, timestamp) VALUES($1, $2, $3, $4, $5) RETURNING *',
    values: [uuid(), input.content, input.author, input.post, new Date()],
  };
  const { rows } = await db.query(query);
  return { comment: rows[0] };
};

module.exports = {
  getHello,
  resolveQuery,
  createUser,
  createComment,
  createPost,
};

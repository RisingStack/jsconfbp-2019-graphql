
const { buildSchema } = require('graphql');

const { getHello, resolveQuery } = require('./fetcher');

// TODO: TASK 1. Add posts query
const schema = buildSchema(`
  enum OrderDirection {
    asc
    desc
  }
  type PageInfo {
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    totalRecords: Int
  }

  enum UserArgField {
    id
    name
    username
    email
  }
  input UserFieldOrder {
    field: UserArgField
    direction: OrderDirection
  }
  type User {
    id: ID
    name: String
    username: String
    email: String
  }
  type UserEdge {
    node: User
  }
  type UserConnection {
    pageInfo: PageInfo
    edges: [UserEdge]
  }

  type Query {
    hello: String
    users: UserConnection
  }
`);

const rootValue = {
  hello: () => getHello(),
  users: (args) => resolveQuery({ table: 'users', args }),
};

module.exports = {
  schema,
  rootValue,
};

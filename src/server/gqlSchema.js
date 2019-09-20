
const { buildSchema } = require('graphql');

const { getHello, resolveQuery } = require('./fetcher');

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

  enum PostArgField {
    id
    title
    description
    content
    author
    timestamp
  }
  input PostFieldOrder {
    field: PostArgField
    direction: OrderDirection
  }
  type Post {
    id: ID
    title: String
    description: String
    content: String
    author: String
    timestamp: String
  }
  type PostEdge {
    node: Post
  }
  type PostConnection {
    pageInfo: PageInfo
    edges: [PostEdge]
  }

  type Query {
    hello: String
    users(limit: Int, offset: Int, order: UserFieldOrder): UserConnection
    posts(limit: Int, offset: Int, order: PostFieldOrder): PostConnection
  }
`);

const rootValue = {
  hello: () => getHello(),
  users: (args) => resolveQuery({ table: 'users', args }),
  posts: (args) => resolveQuery({ table: 'posts', args }),
};

module.exports = {
  schema,
  rootValue,
};

const { gql } = require('apollo-server');

const { getHello, resolveQuery } = require('./fetcher');

// TODO (3) update the user entity with the weather field and add an external reference
// to the Weather entity
const typeDefs = gql`
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
    location: String
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
`;

// TODO (4) define the new root level entry for the User entity and resolve weather there with the
// parameters from the weather schema
const resolvers = {
  Query: {
    hello: () => getHello(),
    users: (args) => resolveQuery({ table: 'users', args: args || {} }),
    posts: (args) => resolveQuery({ table: 'posts', args: args || {} }),
  },
};

module.exports = {
  typeDefs,
  resolvers,
};

const { gql } = require('apollo-server');

const { getHello, resolveQuery } = require('./fetcher');

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

  type User @key(fields: "id"){
    id: ID
    name: String
    username: String
    email: String
    location: String
    weather: Weather
  }

  extend type Weather @key(fields: "location") {
    location: String! @external
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

  extend type Query {
    hello: String
    users(limit: Int, offset: Int, order: UserFieldOrder): UserConnection
    posts(limit: Int, offset: Int, order: PostFieldOrder): PostConnection
  }
`;

const resolvers = {
  User: {
    weather(user) {
      return { __typename: 'Weather', location: user.location };
    },
  },
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

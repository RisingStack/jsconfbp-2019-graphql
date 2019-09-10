const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');

const {
  getHello, resolveQuery,
} = require('./fetcher');
const {
  UserConnection, UserFieldFilter, UserFieldOrder, UserMutations, User,
} = require('./schema/user');
const {
  PostFieldFilter, PostFieldOrder, Post, PostConnection, PostMutations,
} = require('./schema/post');
const {
  CommentFieldFilter, CommentFieldOrder, Comment, CommentConnection, CommentMutations,
} = require('./schema/comment');

const queryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => getHello(),
    },
    users: {
      type: UserConnection,
      args: {
        filters: { type: new GraphQLList(UserFieldFilter) },
        order: { type: UserFieldOrder },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      resolve: (_, args) => resolveQuery({ table: 'users', args }),
    },
    posts: {
      type: PostConnection,
      args: {
        filters: { type: new GraphQLList(PostFieldFilter) },
        order: { type: PostFieldOrder },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      resolve: (_, args) => resolveQuery({ table: 'posts', args }),
    },
    comments: {
      type: CommentConnection,
      args: {
        filters: { type: new GraphQLList(CommentFieldFilter) },
        order: { type: CommentFieldOrder },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      resolve: (_, args) => resolveQuery({ table: 'comments', args }),
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    user: {
      type: UserMutations,
      resolve: () => UserMutations,
    },
    post: {
      type: PostMutations,
      resolve: () => PostMutations,
    },
    comment: {
      type: CommentMutations,
      resolve: () => CommentMutations,
    },
  },
});

module.exports = new GraphQLSchema({
  types: [
    User,
    Post,
    Comment,
  ],
  query: queryType,
  mutation: mutationType,
});

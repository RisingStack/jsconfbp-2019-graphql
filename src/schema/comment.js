const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLEnumType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql');

const { resolveQuery, createComment } = require('../fetcher');
const {
  Node, PageInfo, FilterOperation, OrderDirection, Datetime,
} = require('./common');

const CommentField = new GraphQLEnumType({
  name: 'CommentField',
  values: {
    id: { value: 'id' },
    content: { value: 'content' },
    author: { value: 'author' },
    post: { value: 'post' },
    timestamp: { value: 'timestamp' },
  },
});

const CommentFieldFilter = new GraphQLInputObjectType({
  name: 'CommentFieldFilter',
  fields: {
    value: { type: GraphQLString },
    field: { type: CommentField },
    operation: { type: FilterOperation },
  },
});

const CommentFieldOrder = new GraphQLInputObjectType({
  name: 'CommentFieldOrder',
  fields: {
    field: { type: CommentField },
    direction: { type: OrderDirection },
  },
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  interfaces: [Node],
  isTypeOf: (value) => value instanceof Object,
  fields: () => {
    const { User } = require('./user');
    const { Post } = require('./post');
    return {
      id: { type: GraphQLID },
      content: { type: GraphQLString },
      author: {
        type: User,
        resolve: async (parent) => {
          const resp = await resolveQuery({
            table: 'users',
            args: { filters: [{ field: 'email', operation: '=', value: parent.author }] },
          });
          return resp.edges[0].node;
        },
      },
      post: {
        type: Post,
        resolve: async (parent) => {
          const resp = await resolveQuery({
            table: 'posts',
            args: { filters: [{ field: 'id', operation: '=', value: parent.post }] },
          });
          return resp.edges[0].node;
        },
      },
      timestamp: { type: Datetime },
    };
  },
});

const CommentEdge = new GraphQLObjectType({
  name: 'CommentEdge',
  fields: {
    node: { type: Comment },
  },
});

const CommentConnection = new GraphQLObjectType({
  name: 'CommentConnection',
  fields: {
    pageInfo: { type: PageInfo },
    edges: { type: new GraphQLList(CommentEdge) },
  },
});

const CreateCommentInput = new GraphQLInputObjectType({
  name: 'CreateCommentInput',
  fields: {
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: new GraphQLNonNull(GraphQLString) },
    post: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const CommentMutations = new GraphQLObjectType({
  name: 'CommentMutations',
  fields: {
    createComment: {
      type: Comment,
      args: {
        input: { type: CreateCommentInput },
      },
      resolve: (_, args) => createComment(args),
    },
  },
});

module.exports = {
  CommentField,
  CommentFieldFilter,
  CommentFieldOrder,
  Comment,
  CommentEdge,
  CommentConnection,
  CommentMutations,
};

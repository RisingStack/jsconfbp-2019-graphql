const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLEnumType,
  GraphQLList,
  GraphQLInputObjectType,
} = require('graphql');
const { get } = require('lodash');

const { resolveQuery } = require('../fetcher');
const {
  Node, PageInfo, FilterOperation, OrderDirection,
} = require('./common');

const CommentArgField = new GraphQLEnumType({
  name: 'CommentArgField',
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
    field: { type: CommentArgField },
    operation: { type: FilterOperation },
  },
});

const CommentFieldOrder = new GraphQLInputObjectType({
  name: 'CommentFieldOrder',
  fields: {
    field: { type: CommentArgField },
    direction: { type: OrderDirection },
  },
});

// TODO: TASK 2. uncomment post when TASK 2. is finished
const Comment = new GraphQLObjectType({
  name: 'Comment',
  interfaces: [Node],
  isTypeOf: (value) => value instanceof Object,
  fields: () => {
    const { User } = require('./user');
    // const { Post } = require('./post');
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
          return get(resp, 'edges[0].node', {});
        },
      },
      // post: {
      //   type: Post,
      //   resolve: async (parent) => {
      //     const resp = await resolveQuery({
      //       table: 'posts',
      //       args: { filters: [{ field: 'id', operation: '=', value: parent.post }] },
      //     });
      //     return get(resp, 'edges[0].node', {});
      //   },
      // },
      // timestamp: { type: Datetime },
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

// TODO: TASK 3. CommentMutations and CreateCommentInput
const CommentMutations = {};

module.exports = {
  CommentArgField,
  CommentFieldFilter,
  CommentFieldOrder,
  Comment,
  CommentEdge,
  CommentConnection,
  CommentMutations,
};

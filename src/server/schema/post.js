const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql');
const { get } = require('lodash');

const { resolveQuery, createPost } = require('../fetcher');
const {
  Node, PageInfo, FilterOperation, OrderDirection, Datetime,
} = require('./common');
const { CommentConnection, CommentFieldFilter, CommentFieldOrder } = require('./comment');

const PostArgField = new GraphQLEnumType({
  name: 'PostArgField',
  values: {
    id: { value: 'id' },
    content: { value: 'content' },
    title: { value: 'title' },
    description: { value: 'description' },
    author: { value: 'author' },
    timestamp: { value: 'timestamp' },
  },
});

const PostFieldFilter = new GraphQLInputObjectType({
  name: 'PostFieldFilter',
  fields: {
    value: { type: GraphQLString },
    field: { type: PostArgField },
    operation: { type: FilterOperation },
  },
});

const PostFieldOrder = new GraphQLInputObjectType({
  name: 'PostFieldOrder',
  fields: {
    field: { type: PostArgField },
    direction: { type: OrderDirection },
  },
});

const Post = new GraphQLObjectType({
  name: 'Post',
  interfaces: [Node],
  isTypeOf: (value) => value instanceof Object,
  fields: () => {
    const { User } = require('./user');
    return {
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
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
      timestamp: { type: Datetime },
      comments: {
        type: CommentConnection,
        args: {
          filters: { type: new GraphQLList(CommentFieldFilter) },
          order: { type: CommentFieldOrder },
          limit: { type: GraphQLInt },
          offset: { type: GraphQLInt },
        },
        resolve: (parent, args) => resolveQuery({
          table: 'comments',
          args: {
            ...args,
            filters: [
              ...get(args, 'filters', []).filter((filter) => filter.field !== 'post'),
              { field: 'post', operation: '=', value: parent.id },
            ],
          },
        }),
      },
    };
  },
});

const PostEdge = new GraphQLObjectType({
  name: 'PostEdge',
  fields: {
    node: { type: Post },
  },
});

const PostConnection = new GraphQLObjectType({
  name: 'PostConnection',
  fields: {
    pageInfo: { type: PageInfo },
    edges: { type: new GraphQLList(PostEdge) },
  },
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const PostMutations = new GraphQLObjectType({
  name: 'PostMutations',
  fields: {
    createPost: {
      type: Post,
      args: {
        input: { type: CreatePostInput },
      },
      resolve: (_, args) => createPost(args),
    },
  },
});

module.exports = {
  PostArgField,
  PostFieldFilter,
  PostFieldOrder,
  Post,
  PostEdge,
  PostConnection,
  PostMutations,
};

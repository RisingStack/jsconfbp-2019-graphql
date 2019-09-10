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

const { resolveQuery, createUser } = require('../fetcher');
const {
  Node, PageInfo, FilterOperation, OrderDirection, FieldError,
} = require('./common');
const { PostConnection, PostFieldFilter, PostFieldOrder } = require('./post');
const { CommentConnection, CommentFieldFilter, CommentFieldOrder } = require('./comment');

const UserField = new GraphQLEnumType({
  name: 'UserField',
  values: {
    id: { value: 'id' },
    name: { value: 'name' },
    username: { value: 'username' },
    email: { value: 'email' },
  },
});

const UserFieldFilter = new GraphQLInputObjectType({
  name: 'UserFieldFilter',
  fields: {
    value: { type: GraphQLString },
    field: { type: UserField },
    operation: { type: FilterOperation },
  },
});

const UserFieldOrder = new GraphQLInputObjectType({
  name: 'UserFieldOrder',
  fields: {
    field: { type: UserField },
    direction: { type: OrderDirection },
  },
});

const User = new GraphQLObjectType({
  name: 'User',
  interfaces: [Node],
  isTypeOf: (value) => value instanceof Object,
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
      type: PostConnection,
      args: {
        filters: { type: new GraphQLList(PostFieldFilter) },
        order: { type: PostFieldOrder },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      resolve: (parent, args) => resolveQuery({
        table: 'posts',
        args: {
          ...args,
          filters: [
            ...get(args, 'filters', []).filter((filter) => filter.field !== 'author'),
            { field: 'author', operation: 'eq', value: parent.email },
          ],
        },
      }),
    },
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
            ...get(args, 'filters', []).filter((filter) => filter.field !== 'author'),
            { field: 'author', operation: 'eq', value: parent.email },
          ],
        },
      }),
    },
  },
});

const UserEdge = new GraphQLObjectType({
  name: 'UserEdge',
  fields: {
    node: { type: User },
  },
});

const UserConnection = new GraphQLObjectType({
  name: 'UserConnection',
  fields: {
    pageInfo: { type: PageInfo },
    edges: { type: new GraphQLList(UserEdge) },
  },
});

const UserMutateResponseType = new GraphQLObjectType({
  name: 'UserMutateResponseType',
  fields: {
    user: { type: User },
    errors: { type: new GraphQLList(FieldError) },
  },
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const UserMutations = new GraphQLObjectType({
  name: 'UserMutations',
  fields: {
    createUser: {
      type: UserMutateResponseType,
      args: {
        input: { type: CreateUserInput },
      },
      resolve: (_, args) => createUser(args),
    },
  },
});

module.exports = {
  UserField,
  UserFieldFilter,
  UserFieldOrder,
  User,
  UserEdge,
  UserConnection,
  UserMutations,
};

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql');

const { createPost } = require('../fetcher');

// TODO: TASK 2. Post schemas
const PostArgField = {};
const PostFieldFilter = {};
const PostFieldOrder = {};
const Post = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLID },
  },
});
const PostEdge = {};
const PostConnection = {};

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

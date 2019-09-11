const {
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLScalarType,
} = require('graphql');

const Node = new GraphQLInterfaceType({
  name: 'Node',
  description: 'An entity with an ID',
  fields: {
    id: { type: GraphQLID, description: 'The id of the node' },
  },
});

const PageInfo = new GraphQLObjectType({
  name: 'PageInfo',
  description: 'Information about pagination in a connection.',
  fields: {
    hasNextPage: {
      type: GraphQLBoolean,
      description: 'If there are more items when paginating forwards.',
    },
    hasPreviousPage: {
      type: GraphQLBoolean,
      description: 'If there are more items when paginating backwards.',
    },
    totalRecords: {
      type: GraphQLInt,
      description: 'The total number of records available for pagination.',
    },
  },
});

const FilterOperation = new GraphQLEnumType({
  name: 'FilterOperation',
  values: {
    eq: { value: '=', description: 'Field must be equal to value.' },
    ge: { value: '>=', description: 'Field must be greater than or equal to value.' },
    gt: { value: '>', description: 'Field must be greater than value.' },
    like: { value: 'LIKE', description: 'Field must be like value, % is any String.' },
    le: { value: '<=', description: 'Field must be less than or equal to value.' },
    lt: { value: '<', description: 'Field must be less than value.' },
    ne: { value: '!=', description: 'Field must not equal value.' },
  },
});

const OrderDirection = new GraphQLEnumType({
  name: 'OrderDirection',
  values: {
    asc: { value: 'asc', description: 'Ascending' },
    desc: { value: 'desc', description: 'Descending' },
  },
});

const Datetime = new GraphQLScalarType({
  name: 'Datetime',
  description: 'A datetime as an ISO 8601 formatted string',
  serialize: (value) => value,
});

module.exports = {
  Node,
  PageInfo,
  FilterOperation,
  OrderDirection,
  Datetime,
};

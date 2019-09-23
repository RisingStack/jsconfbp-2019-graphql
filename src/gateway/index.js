const { ApolloGateway } = require('@apollo/gateway');
const { ApolloServer } = require('apollo-server');

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: 'cms',
      url: 'http://localhost:8000/graphql',
    },
    {
      name: 'weather',
      url: 'http://localhost:8100/graphql',
    },
  ],
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

server.listen(3000);

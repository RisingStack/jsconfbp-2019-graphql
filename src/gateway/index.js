const { ApolloGateway } = require('@apollo/gateway');
const { ApolloServer } = require('apollo-server');

const gateway = new ApolloGateway({
  serviceList: [
    // TODO (5) list locally running services
  ],
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

server.listen(3000);

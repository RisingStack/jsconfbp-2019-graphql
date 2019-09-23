const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools');

const link = new HttpLink({ uri: 'https://graphql-pokemon.now.sh', fetch });

module.exports = async () => {
  const schema = await introspectSchema(link);

  const executableSchema = makeRemoteExecutableSchema({
    schema,
    link,
  });

  return executableSchema;
};

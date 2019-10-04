const {GraphQLServer} = require('graphql-yoga');
const data = require('./data'); // Instanciar o arquivo data


const typeDefs = `
type Channel {
    idChannel: Int,
    name: String
}
type Query{
    channels:[Channel]
}
`;
const resolvers = {
    Query: {
        channels() {
            return data.getData('channels');

        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers });
server.start();

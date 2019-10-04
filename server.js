const { GraphQLServer } = require('graphql-yoga');
const data = require('./data'); // Instanciar o arquivo data

const typeDefs = `
type Channel {
    idChannel: Int,
    name: String,
    playlists: [Playlist]
}

type Playlist{
    idPlaylist: Int,
    name: String
}
type Query{
    channels(idChannel: Int):[Channel]
}
`;
const resolvers = {
    Query: {
        channels(obj, args) {
            return data.getData('channels', 'idChannel', args.idChannel);

        }
    },
    Channel: {
        playlists: function (obj, args) {
            return data.getData('playlists', 'idChannel', obj.idChannel);

        }
    }
}


const server = new GraphQLServer({ typeDefs, resolvers });
server.start();

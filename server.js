const { GraphQLServer } = require('graphql-yoga');

const typeDefs = ` 

type Channel {
    idChannel: Int,
    name: String,
    playlists: [PLaylist]
}

type Playlist{
    idPlaylist: Int,
    idChannel: Int,
    name: String
}

type Query{
    channels:([idChannel:int]): [Channel]
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
};


const server = new GraphQLServer({ typeDefs, resolvers });
server.start();

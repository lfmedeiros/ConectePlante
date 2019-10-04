const {GraphQLServer} = require('graphql-yoga');
const data = require('./data'); // Instanciar o arquivo data

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/conecteplante', {useNewUrlParser: true});


const Product = mongoose.model('Product', {
    name:String,
    price: Number,
    description: String,
    category: String    


 


});


const tomato = new Product({
    name: "Tomate",
    price: "2",
    description: "Tomate cereja",
    category: "Fruta"
});

tomato
    .save()
    .then(() => console.log('Ack'));





const typeDefs = `
type Channel {
    idChannel: Int,
    name: String,
    playlists: [Playlist]
}

type Playlist {
    idPlaylist: Int,
    name: String,
    videos: [Video]
}

type Video {
    idVideo: Int,
    title: String,
    views: Int
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
    },

    Playlist: {
        videos: function (obj, args) {
            return data.getData('videos', 'idPlaylist', obj.idPlaylist);
        }
    }
};

const server = new GraphQLServer({typeDefs, resolvers});
server.start();

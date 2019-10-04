const {GraphQLServer} = require('graphql-yoga');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/conecteplante',{useNewUrlParser: true});

const Product = mongoose.model('Product', {
    name: String,
    price: String,
    description: String,
    category: String
});

const tomato = new Product({name: "Tomate", price: "2", description: "Tomate cereja", category: "Fruta"});
tomato
    .save()
    .then(() => console.log('Ack'));

const typeDefs = `type Query {
     getProduct(id: ID!): Product
     getProducts: [Product]
 }
 type Product {
     id: ID!
     name: String!
     price: String!
     description: String!
     category: String!
 }

 type Mutation {
     addProduct(name: String!, price: String!, description: String!, category: String!): Product!,
     deleteProduct(id:ID!): String 
  
 }`

const resolvers = {
    Query: {
        getProducts: () => Product.find(),
        getProduct: async (_, {id}) => {
            var result = await Product.findById(id);
            return result;
        }

    },
    Mutation: {
        addProduct: async (_, {name, price, description, category}) => {
            const product = new Product({name, price, description, category});
            await product.save();
            return product;
        },
        deleteProduct: async(_,{id}) => {
            await Product.findByIdAndRemove(id);
            return "Product Deleted";
        }
    }
};

const server = new GraphQLServer({typeDefs, resolvers});
server.start();

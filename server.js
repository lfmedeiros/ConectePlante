const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

//**************************** Database definitions ****************************

// Database connection
mongoose.connect('mongodb://localhost:27017/conecteplante', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var dateTime = new Date();

//Collections
const Product = mongoose.model('Product', {
    name: String,
    price: String,
    description: String,
    category: String,
    activeProduct: Boolean,
    createdAt: Date,
    updatedAt: Date
});

//Schema
var userSchema = new mongoose.Schema({
    name: String,
    cpf: { type: Number },
    telfone: { type: Number },
    createdAt: Date,
    updated: { type: Date },
    email: String,
    age: { type: Number, min: 18, max: 90 },
    admin: { type: Boolean }
});

var User = mongoose.model('User', userSchema);

var Lucas = new User({
    name: "Lucas Medeiros",
    cpf: 09377768900,
    telfone: 988229779,
    createdAt: dateTime,
    updated: new Date(),
    email: "lucamede@gmail.com",
    age: 19,
    admin: true
});
Lucas
    .save()
    .then(() => console.log('User Added'));

//Documents
const batata = new Product(
    { name: "Batata", price: "4", description: "Batata", category: "Legume", timeStamp: dateTime, activeProduct: true }
);
batata
    .save()
    .then(() => console.log(
        'Product added|ID:' + batata.id + '|Description:' + batata.description
    ));

//**************************** Type Defs ************************************
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
     createdAt: String!
     updatedAt: String!
 }

 type Mutation {
     addProduct(name: String!, price: String!, description: String!, category: String!, createdAt: String!, updatedAt: String!): Product!,
     deleteProduct(id:ID!): String 
  
 }`

//**************************** Resolvers ***********************************
const resolvers = {
    Query: {
        getProducts: () => Product.find(),
        getProduct: async (_, { id }) => {
            var result = await Product.findById(id);
            return result;
        }

        //**************************** Mutations **********************************
    },
    Mutation: {
        addProduct: async (_, { name, price, description, category }) => {
            const product = new Product({ name, price, description, category });
            await product.save();
            return product, "Product Added";

        },
        deleteProduct: async (_, { id }) => {
            await Product.findByIdAndRemove(id);
            return "Product Deleted";
        }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start();


app.listen(3000, function(){
    console.log('server running on port3000')
});

app.get('/',(req, res) => {
    res.send(Lucas.name +  Lucas.id)
});
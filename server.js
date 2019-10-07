const {GraphQLServer} = require('graphql-yoga');
const mongoose = require('mongoose');

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

const Test = mongoose.model('Test',{
    name: String,
    price: String,
    tag: String,
    timeStamp: Date

})

//Documents
const batata = new Product(
    {name: "Batata", price: "4", description: "Batata", category: "Legume", timeStamp: dateTime, activeProduct: true}
);
batata
    .save()
    .then(() => console.log(
        'Product added|ID:' + batata.id + '|Description:' + batata.description
    ));



const test = new Test({
    name: "String",
    price: "500",
    tag: "True",
    timeStamp: dateTime
});
test
    .save()
    .then(() => console.log ("Sucesso" +' ' +  dateTime));


    


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
        getProduct: async (_, {id}) => {
            var result = await Product.findById(id);
            return result;
        }


 //**************************** Mutations **********************************
    },
    Mutation: {
        addProduct: async (_, {name, price, description, category}) => {
            const product = new Product({name, price, description, category});
            await product.save();
            return product, "Product Added";

        },
        deleteProduct: async (_, {id}) => {
            await Product.findByIdAndRemove(id);
            return "Product Deleted";
        }
    }
};

const server = new GraphQLServer({typeDefs, resolvers});
server.start();

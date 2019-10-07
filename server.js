const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

function main() {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}
main();

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

const User = mongoose.model('User', {
    username: String,
    email: String,
    password: String
});

//**************************** Type Defs ************************************
const typeDefs = `type Query {
     getProduct(id: ID!): Product
     getProducts: [Product]
     me: User
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
 
 type User {
     id: Int!
     username: String!
     email: String!
}

 type Mutation {
     addProduct(name: String!, price: String!, description: String!, category: String!, createdAt: String!, updatedAt: String!): Product!,
     deleteProduct(id:ID!): String 
     signup(username: String!, email: String!, password: String!): String
     login(email: String!, password: String!): String
}`

//**************************** Resolvers ***********************************
const resolvers = {
    Query: {
        getProducts: () => Product.find(),
        getProduct: async (_, { id }) => {
            var result = await Product.findById(id);
            return result;
        },
        async me(_, args, { user }) {
            if (!user) {
                throw new Error('You are not authenticated')
            }
            return await User.findById(user.id)
        }
    },

    //**************************** Mutations **********************************

    Mutation: {
        addProduct: async (_, { name, price, description, category }) => {
            const product = new Product({ name, price, description, category });
            await product.save();
            return product, "Product Added";
        },

        deleteProduct: async (_, { id }) => {
            await Product.findByIdAndRemove(id);
            return "Product Deleted";
        },

        async signup(_, { username, email, password }) {
            const user = await User.create({
                username,
                email,
                password: await bcrypt.hash(password, 10)
            })

            // return json web token
            return jsonwebtoken.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1y' }
            )
        },
        // Handles user login
        async login(_, { email, password }) {
            const user = await User.findOne({ where: { email } })

            if (!user) {
                throw new Error('No user with that email')
            }

            const valid = await bcrypt.compare(password, user.password)

            if (!valid) {
                throw new Error('Incorrect password')
            }

            // return json web token
            return jsonwebtoken.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )
        }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start();


app.get('/', (req, res) => {
    res.send('JWT TESTE')
});
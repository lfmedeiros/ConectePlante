const mongoose = require('mongoose');
const express = require('express');

const app = express();

mongoose.connect('mongodb://localhost:27017/graphql', {useNewUrlParser: true});

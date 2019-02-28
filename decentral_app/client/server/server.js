// Imported required packages
const express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cors = require('cors'),
mongoose = require('mongoose');

// MongoDB Databse url
var mongoDatabase = 'mongodb://fyp18003:password18003@ds062797.mlab.com:62797/dapp';

// Created express server
const app = express();
mongoose.Promise = global.Promise;

// Connect Mongodb Database
mongoose.connect(mongoDatabase, { useNewUrlParser: true }).then(
() => { console.log('Database is connected') },
err => { console.log('There is problem while connecting database ' + err) }
);

// All the express routes
const userRoutes = require('../routes/User.route');
const artworkRoutes = require('../routes/Artwork.route');

// Conver incoming data to JSON format
app.use(bodyParser.json());

// Enabled CORS
app.use(cors());

// Setup for the server port number
const port = process.env.PORT || 4000;

// Routes Configuration
app.use('/users', userRoutes);
app.use('/artworks', artworkRoutes);

// Staring our express server
const server = app.listen(port, function () {
console.log('Server Lisening On Port : ' + port);
});

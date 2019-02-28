// Importing important packages
const express = require('express');

// Using express and routes
const app = express();
const artworkRoute = express.Router();

// Artwork module which is required and imported
let ArtworkModel = require('../model/Artwork');

// To Get List Of Artworks
artworkRoute.route('/').get(function (req, res) {
  ArtworkModel.find(function (err, Artwork) {
    if (err) {
      console.log(err);
    } else {
      res.json(Artwork);
    }
  });
});

// To Upload artwork
// todo interact with cloud service & ethereum
artworkRoute.route('/uploadArtwork').post(function (req, res) {
  let Artwork = new ArtworkModel(req.body);
  Artwork.save().then(game => {
    res.status(200).json({ 'Artwork': 'Artwork Added Successfully' });
  }).catch(err => {
    res.status(400).send("Something Went Wrong");
  });
});

//Get Artwork by author id
artworkRoute.route('/allBy/:author').get(function (req, res) {
  let author = req.params.author;
  ArtworkModel.find({'author': author}, function(err, User){
    res.json(User);
  });
});

module.exports = artworkRoute;

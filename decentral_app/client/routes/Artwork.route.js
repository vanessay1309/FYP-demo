// Importing important packages
const express = require('express');
const Web3 = require('web3');
const GalleryContract =  require('../src/contracts/Gallery.json');

// Using express and routes
const app = express();
const artworkRoute = express.Router();

// modules which are required and imported
let ArtworkModel = require('../model/Artwork');

//Get web3Provider
const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

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

//Get Artwork through ethereum
artworkRoute.route('/byE/:author/:image').get(function (req, res) {
  let authorId = req.params.author;
  let imageId = req.params.image;

  const componentDidMount = async function() {
    try {
      // Get network provider and web3 instance.
      // const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GalleryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        GalleryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      // Get the value from the contract to prove it worked.
      const response = await instance.methods.retrieveArtworkInfo(authorId,imageId).call();

      // Update state with the result.
      res.json(response[2]);
      // res.json("hi");
    } catch (error) {
      // Catch any errors for any of the above operations.
      res.json("Failed to load web3, accounts, or contract. Check console for details.");
      console.error(error);
    }
  };

  componentDidMount();
});

module.exports = artworkRoute;

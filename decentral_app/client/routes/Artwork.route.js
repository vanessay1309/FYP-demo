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


//Get contract instance
let accounts, networkId, deployedNetwork, instance;
const componentDidMount = async function() {
  try {
    // Use web3 to get the user's accounts.
    accounts = await web3.eth.getAccounts();

    // Get the contract instance.
    networkId = await web3.eth.net.getId();
    deployedNetwork = GalleryContract.networks[networkId];
    instance = new web3.eth.Contract(
      GalleryContract.abi,
      deployedNetwork && deployedNetwork.address,
    );

  } catch (error) {
    // Catch any errors for any of the above operations.
    console.error(error);
  }
};
componentDidMount();

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
artworkRoute.route('/uploadArtwork').post(function (req, res) {
  let Artwork = new ArtworkModel(req.body);

  //CLOUD UPLOAD here

  //Call back to mongo
  Artwork.save(function(err, artwork){
    if (err){
      console.log(err);
    }else{
      // res.status(200).json({ 'Artwork': 'Artwork Added Successfully' });
      //Call back to Ethereum
      const callInstance = async function() {
          try {
              let name = JSON.stringify(req.body.name);
              let access = JSON.stringify("temp");
              let author = req.body.author;

              let temp = JSON.stringify(artwork._id);
              let image = temp.replace(/['"]+/g,'');


                await instance.methods.addArtwork(name, access, author, image).call();
                res.json("success");

          } catch (error) {
            // Catch any errors for any of the above operations.
            // res.json("Failed to load web3, accounts, or contract. Check console for details.");
            console.error(error);
          }
        };
      callInstance();
    }
  });
});

//Get all Artworks by author id
artworkRoute.route('/allBy/:author').get(function (req, res) {
  let author = req.params.author;

  //Find all artworks by an author and return their id
  ArtworkModel.find({'author': author},'_id', function(err, id){
    if (err){
      console.log(err);
    }else{
      const callInstance = async function() {
          try {
              for (var i=0; i< id.length; i++){
                let temp = JSON.stringify(id[i]._id);
                let image = temp.replace(/['"]+/g,'');
                const response = await instance.methods.retrieveArtworkInfo(author, image).call();
                let result = JSON.stringify(response);
                res.write(result);
              }

            return res.end();

          } catch (error) {
            // Catch any errors for any of the above operations.
            // res.json("Failed to load web3, accounts, or contract. Check console for details.");
            console.error(error);
          }
        };
      callInstance();
    }
  });
});

//Get an Artwork through ethereum
artworkRoute.route('/byE/:author/:image').get(function (req, res) {
  let authorId = req.params.author;
  let imageId = req.params.image;

  const callInstance = async function() {
    try {
      const response = await instance.methods.retrieveArtworkInfo(authorId,imageId).call();

      // Update state with the result.
      res.json(response);
      // res.json("hi");
    } catch (error) {
      // Catch any errors for any of the above operations.
      res.json("Failed to load web3, accounts, or contract. Check console for details.");
      console.error(error);
    }
  };
  //
  // componentDidMount();
  callInstance();
});

module.exports = artworkRoute;

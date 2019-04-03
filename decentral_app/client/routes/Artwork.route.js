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

// To Get List Of Artworks from Ethereum
// TODO decide logic to get front page
artworkRoute.route('/').get(function (req, res) {
  //Find all artworks by an author and return their id
  ArtworkModel.find(function(err, Artwork){
    if (err){
      console.log("[retrieveAll] Mongo retrieve artworks error: "+err);
      res.json("Failed to retrieve artwork. Please try again");
    }else{
      console.log("[retrieveAll] retrieved from Mongo successfully, now retrieve from Ethereum")
      const callInstance = async function() {

          try {
            res.write("[")
              for (var i=0; i< Artwork.length; i++){
                let tempI = JSON.stringify(Artwork[i]._id);
                let image_id = tempI.replace(/['"]+/g,'');
                let tempA = JSON.stringify(Artwork[i].author);
                let author_id = tempA.replace(/['"]+/g,'');

                const response = await instance.methods.retrieveArtworkInfo(author_id, image_id).call();
                let result = JSON.stringify(response);
                res.write(result);

                if (i != (Artwork.length-1)){
                  res.write(',')
                }
              }
            res.write("]")
            console.log("[retrieveAll] retrieved from Ethereum successfully, return to client")
            return res.end();

          } catch (error) {
            // Catch any errors for any of the above operations.
            // res.json("Failed to load web3, accounts, or contract. Check console for details.");
            console.log("[retrieveAll] Ethereum retrieve artwork error: "+err);
          }
        };
      callInstance();
    }
  });
});

// To Get List Of Artworks from mongo (temp function)
artworkRoute.route('/mongo').get(function (req, res) {
  ArtworkModel.find(function (err, Artwork) {
    if (err) {
        console.log("[mongo retrieveAll] Mongo retrieve error"+error);
      } else {
        res.json(Artwork);
      }
    });
});

// To Upload artwork
artworkRoute.route('/uploadArtwork').post(function (req, res) {
  // set all variables to save
  let author_id = req.body.author
  let name = req.body.name

  // only stroing author_id (& name for testing) to MongoDB
  let Artwork = new ArtworkModel({author: author_id, name: name})

  //TODO CLOUD UPLOAD here, return access token
  let accessL = "token"
  //
  // //cloudinary widget call
  // let widget = cloudinary.createUploadWidget({
  //   cloudName: 'fyp18003',
  //   uploadPreset: 'tt3uhkl0',
  //   sources: ['local', 'url'],
  // }, (error, result) => {
  //
  //   if (result.event === "success") {
  //
  //     window.alert(result.info.secure_url);
  //     accessL = result.info.secure_url;
  //     public_id = result.public_id;
  //    signature = result.signature;
  //    delete function:
  //    authentication
  //
  //    cloudinary.v2.uploader.destroy(public_id, options, callback);
  //
  // }
  // });
  //   widget.open();
  //delete artwork call

 // cloudinary.v2.uploader.destroy("#public id", 
  function(error, result) {console.log(result, error) });

  //Call back to mongo
  Artwork.save(function(err, artwork){
    if (err){
      console.log("[uploadArtwork] Mongo saving error: "+err);
    }else{
      console.log("[uploadArtwork] saved to mongo successfully, now save to block")
      let temp = JSON.stringify(artwork._id);
      let image_id = temp.replace(/['"]+/g,'');

      // Call back to Ethereum
      const callInstance = async function() {
          try {
              // retrieve and parse image_id from newly save model in Mongo
              let temp = JSON.stringify(artwork._id);
              let image_id = temp.replace(/['"]+/g,'');

              await instance.methods.addArtwork(name, accessL.replace(/['"]+/g,''), author_id, image_id).call();
              console.log("[uploadArtwork] saved to contract successfully, return to client")
              res.status(200).json({ 'Artwork': 'Artwork Added Successfully' });

          } catch (error) {
            // Catch any errors for any of the above operations.
            // res.json("Failed to load web3, accounts, or contract. Check console for details.");
            console.error("[uploadArtwork] Contract saving error: "+error);
          }
        };
      callInstance();
    }
  });
});

//Get all Artworks particular author
artworkRoute.route('/allBy/:author').get(function (req, res) {
  let author = req.params.author;

  //Find all artworks by an author and return their id
  ArtworkModel.find({'author': author},'_id', function(err, id){
    if (err){
      console.log(err);
    }else{
      console.log("[byAuthor] retrieved from Mongo successfully, now retrieve from Ethereum")
      const callInstance = async function() {

          try {
            res.write("[")
              for (var i=0; i< id.length; i++){
                let temp = JSON.stringify(id[i]._id);
                let image = temp.replace(/['"]+/g,'');
                const response = await instance.methods.retrieveArtworkInfo(author, image).call();
                let result = JSON.stringify(response);
                res.write(result);
                if (i != (id.length-1)){
                  res.write(',')
                }
              }
            res.write("]")
            console.log("[byAuthor] retrieved from Ethereum successfully, return to client")
            return res.end();

          } catch (error) {
            // Catch any errors for any of the above operations.
            // res.json("Failed to load web3, accounts, or contract. Check console for details.");
            console.log("[byAuthor] Ethereum retrieve artwork error: "+err);
          }
        };
      callInstance();
    }
  });
});

//Get an Artwork Through Ethereum
artworkRoute.route('/byE/:author/:image').get(function (req, res) {
  let authorId = req.params.author;
  let imageId = req.params.image;

  const callInstance = async function() {
    try {
      const response = await instance.methods.retrieveArtworkInfo(authorId,imageId).call();

      // Update state with the result.
      res.json(response);
    } catch (error) {
      // Catch any errors for any of the above operations.
      res.json("Failed to retrieve artwork. Please try again");
      console.error(error);
    }
  };
  //
  // componentDidMount();
  callInstance();
});

//Given an artwork, add a source for it
artworkRoute.route('/addSource/:image/:source').get(function (req, res) {
});

//Given an artwork, add a derivative for it
artworkRoute.route('/addSource/:image/:der').get(function (req, res) {
});

module.exports = artworkRoute;

// Importing important packages
const express = require('express');
const Web3 = require('web3');
const obj = require('lodash/fp/object')
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
artworkRoute.route('/').get(function (req, res) {

  //Find all artworks in Mongo
  ArtworkModel.find(function(error, Artwork){
    if (error){
      console.log("[retrieveAll] Mongo retrieve artworks error: "+error);
      res.status(500).json({message: error.toString()});
    }else{
      console.log("[retrieveAll] retrieved from Mongo successfully, now retrieve from Ethereum")

      let Json = {
        Artworks:[]
      };

      // Retreiev artworks from Ethereum
      const callInstance = async function() {
          try {
              for (var i=0; i< Artwork.length; i++){
                let tempI = JSON.stringify(Artwork[i]._id);
                let image_id = tempI.replace(/['"]+/g,'');
                let tempA = JSON.stringify(Artwork[i].author);
                let author_id = tempA.replace(/['"]+/g,'');

                const response = await instance.methods.retrieveArtworkInfo(author_id, image_id).call();
                // if this is a valid artwork uploaded to Ethereum
                if (response[2] != ""){
                  let result = {'author_id': response[0], 'image_id': response[1],'name': response[2], 'access': response[3]}
                  Json.Artworks.push(result);
                }
              }
            console.log("[retrieveAll] retrieved from Ethereum successfully, return to client")
            res.json(Json)

          } catch (error) {
            // Catch any errors for any of the above operations.
            console.log("[retrieveAll] Ethereum retrieve artwork error: "+error);
            res.status(500).json({message: error.toString()});
          }
        };
      callInstance();

    }
  });
});

// To Get List Of Artworks from mongo (temp function)
artworkRoute.route('/mongo').get(function (req, res) {
  ArtworkModel.find(function (err, Artwork) {
    if (error) {
        console.log("[mongo retrieveAll] Mongo retrieve error"+error);
      } else {
        res.json(Artwork);
      }
    });
});

// To Upload artwork
artworkRoute.route('/uploadArtwork').post(function (req, res) {

  let author_id = req.body.author
  let name = req.body.name

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
  // function(error, result) {console.log(result, error) });

  // only stroing author_id (& name for testing) to MongoDB
  let Artwork = new ArtworkModel({author: author_id, name: name})

  //Call back to mongo
  Artwork.save(function(error, artwork){
    if (error){
      console.log("[uploadArtwork] mongo saving error: "+error);
      res.status(500).json({message: error.toString()});
    }else{
      console.log("[uploadArtwork] saved to mongo successfully, now save to block")

      // Call back to Ethereum
      const callInstance = async function() {
          try {
              // retrieve and parse image_id from newly save model in Mongo
              let temp = JSON.stringify(artwork._id);
              let image_id = temp.replace(/['"]+/g,'');

              console.log("[uploadArtwork] calling addArtwork from account:"+accounts[0]);
              await instance.methods.addArtwork(name, accessL, author_id, image_id).send({ from: accounts[0], gas: 300000 });

              console.log("[uploadArtwork] saved to contract successfully, return to client")
              res.status(200).json({message:"Success"});

          } catch (error) {
            // Catch any errors for any of the above operations.
            console.error("[uploadArtwork] Contract saving "+error);
            res.status(500).json({message: error.toString()});
          }
        };
      callInstance();
    }
  });
});

//Get all Artworks particular author
artworkRoute.route('/byAuthor/:author').get(function (req, res) {
  let author = req.params.author;

  //Find all artworks by an author and return their id
  ArtworkModel.find({'author': author},'_id', function(error, id){
    if (error){
      console.log("[getByAuthor] getting from mongo artworks by "+author+": "+error);
      res.status(500).json({message: error.toString()});
    }else{
      console.log("[getByAuthor] retrieved from Mongo successfully, now retrieve from Ethereum")
      let Json = {
        Artworks:[]
      };

      const callInstance = async function() {
          try {
              for (var i=0; i< id.length; i++){
                let temp = JSON.stringify(id[i]._id);
                let image = temp.replace(/['"]+/g,'');

                const response = await instance.methods.retrieveArtworkInfo(author, image).call();
                //ignore artworks with no name (failed upload to Ethereum but successed in Mongo)
                if (response[2] != ""){
                  let result = {'author_id': response[0], 'image_id': response[1],'name': response[2], 'access': response[3]}
                  Json.Artworks.push(result);
                }
              }

            console.log("[getByAuthor] retrieved from Ethereum successfully, return to client")
            res.json(Json);

          } catch (error) {
            // Catch any errors for any of the above operations.
            console.log("[getByAuthor] ethereum retrieves artworks by "+author+" failed: "+error);
            res.status(500).json({message: error.toString()});
          }
        };
      callInstance();
    }
  });
});

//Get an Artwork Through Ethereum
artworkRoute.route('/details/:author/:image').get(function (req, res) {
  let author = req.params.author;
  let image = req.params.image;

  const callInstance = async function() {
    try {
      const response = await instance.methods.retrieveArtworkInfo(author,image).call();
      let result = {'author_id': response[0], 'image_id': response[1],'name': response[2], 'access': response[3]}
      res.json(result);
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log("[details] getting from Ethereum artworks "+image+": "+error);
      res.status(500).json({message: error.toString()});
    }
  };
  callInstance();
});

//Given an artwork, add a source for it
artworkRoute.route('/addSource/:image/:source').get(function (req, res) {
});

//Given an artwork, add a derivative for it
artworkRoute.route('/addSource/:image/:der').get(function (req, res) {
});

module.exports = artworkRoute;

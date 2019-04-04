// Importing important packages
const express = require('express');
const Web3 = require('web3');
const GalleryContract =  require('../src/contracts/Gallery.json');

// Using express and routes
const app = express();
const artworkRoute = express.Router();

// modules which are required and imported
let ArtworkModel = require('../model/Artwork');
let UserModel = require('../model/User');

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
                // parse string into bytes32 for contract
                let tempI = JSON.stringify(Artwork[i]._id);
                let image_id = web3.utils.asciiToHex(tempI.replace(/['"]+/g,''), 32);
                let tempA = JSON.stringify(Artwork[i].author_id);
                let author_id = web3.utils.asciiToHex(tempA.replace(/['"]+/g,''), 32);

                const response = await instance.methods.retrieveArtwork(author_id, image_id).call();

                // if this is a valid artwork uploaded to Ethereum (with a name)
                if (response[2] != ""){
                  let result = {'author_id': web3.utils.hexToUtf8(response[0]), 'image_id': web3.utils.hexToUtf8(response[1]),'name': response[2], 'author':Artwork[i].author,  'access': response[3]};
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
  ArtworkModel.find(function (error, Artwork) {
    if (error) {
        console.log("[mongo retrieveAll] Mongo retrieve error"+error);
      } else {
        res.json(Artwork);
      }
    });
});

// To Upload artwork
artworkRoute.route('/uploadArtwork').post(function (req, res) {
  let author_id = req.body.author_id
  let name = req.body.name
  let caption = req.body.caption
  let author = "";

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
//
  UserModel.findById(author_id, function(error, author){
    if (error){
      console.log("[uploadArtwork] Mongo retrieve user name error: "+error);
      res.status(500).json({message: error.toString()});
    }else{
      console.log("[uploadArtwork] retrieved user name from Mongo successfully, now retrieve from Ethereum")
      let Artwork = new ArtworkModel({author_id: author_id, name: name, author: author.name});

      Artwork.save(function(error, artwork){
        if (error){
          console.log("[uploadArtwork] mongo saving artwork error: "+error);
          res.status(500).json({message: error.toString()});
        }else{
          console.log("[uploadArtwork] artwork saved to mongo successfully, now save to contract");

          const callInstance = async function() {
              try {
                  // parse id from string to bytes32 for contract
                  let tempA = JSON.stringify(artwork.author_id);
                  let author_id = web3.utils.asciiToHex(tempA.replace(/['"]+/g,''), 32);
                  let tempI = JSON.stringify(artwork._id);
                  let image_id = web3.utils.asciiToHex(tempI.replace(/['"]+/g,''), 32);

                  console.log("[uploadArtwork] calling addArtwork from account:"+accounts[0]);
                  await instance.methods.addArtwork(author_id, image_id, name, caption, accessL).send({ from: accounts[0], gas: 300000 });

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
    }
  });
});


// //Get all Artworks by a given author
artworkRoute.route('/byAuthor/:author').get(function (req, res) {
  let author = req.params.author;

//   //Find all artworks by an author and return their id
  ArtworkModel.find({'author_id': author},'_id', function(error, id){
    if (error){
      console.log("[getByAuthor] getting from mongo artworks by "+author+": "+error);
      res.status(500).json({message: error.toString()});
    }else{
      console.log("from mongo:"+id);
      console.log("[getByAuthor] retrieved from Mongo successfully, now retrieve from Ethereum")
      let Json = {
        Artworks:[]
      };

      const callInstance = async function() {
          try {
              for (var i=0; i< id.length; i++){
                // parse id from string to bytes32 for contract
                let tempI = JSON.stringify(id[i]._id);
                let author_id = web3.utils.asciiToHex(author.replace(/['"]+/g,''), 32);
                let image_id = web3.utils.asciiToHex(tempI.replace(/['"]+/g,''), 32);

                const response = await instance.methods.retrieveArtwork(author_id, image_id).call();
                //ignore artworks with no name (failed upload to Ethereum but successed in Mongo)
                if (response[2] != ""){
                  let result = {'author_id': web3.utils.hexToUtf8(response[0]), 'image_id': web3.utils.hexToUtf8(response[1]),'name': response[2], 'access': response[3]};
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
      // parse id from string to bytes32 for contract
      let author_id = web3.utils.asciiToHex(author.replace(/['"]+/g,''), 32);
      let image_id = web3.utils.asciiToHex(image.replace(/['"]+/g,''), 32);

      const response = await instance.methods.retrieveArtworkInfo(author_id, image_id).call();
      console.log("[details] Mongo retrieve artwork successfully, now retrieve details of source and derivative");
      let sources = [];
      let derivatives = [];

      // //for each source and derivative, retrieve artwork
      for (var i=0; i< response[5].length; i++){
        let s_id = web3.utils.hexToUtf8(response[5][i]);
        await ArtworkModel.findById(s_id, function(error, Artwork){
          if (error){
            console.log("[details] Mongo retrieve sources error: "+error);
            res.status(500).json({message: error.toString()});
          }else{
            // sources.push(Artwork);
            sources.push({'author_id': Artwork.author_id, 'image_id': Artwork.author_id,'name': Artwork.name, 'author': Artwork.author});
            console.log("[details] retrieved sources from Mongo successfully, now return to client")
          }
        });
      }

      for (var i=0; i< response[6].length; i++){
        let d_id = web3.utils.hexToUtf8(response[6][i]);
        await ArtworkModel.findById(d_id, function(error, Artwork){
          if (error){
            console.log("[details] Mongo retrieve derivatives error: "+error);
            res.status(500).json({message: error.toString()});
          }else{
            derivatives.push(Artwork);
            console.log("[details] retrieved derivatives from Mongo successfully, now return to client")
          }
        });
      }

      let result = {'author_id': web3.utils.hexToUtf8(response[0]), 'image_id': web3.utils.hexToUtf8(response[1]),'name': response[2], 'caption': response[3], 'access': response[4], 'sources': sources, 'derivatives': derivatives};
      res.json(result);
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log("[details] getting from Ethereum artworks "+image+": "+error);
      res.status(500).json({message: error.toString()});
    }
  };
  callInstance();
});

//Given an artwork, add sources of it
artworkRoute.route('/addSource').post(function (req, res) {
  let author = req.body.author_id;
  let image = req.body.image_id;
  let source = req.body.source;

  const callInstance = async function() {
    try {
      // parse id from string to bytes32 for contract
      let author_id = web3.utils.asciiToHex(author.replace(/['"]+/g,''), 32);
      let image_id = web3.utils.asciiToHex(image.replace(/['"]+/g,''), 32);
      let source_id = [];

      for (var i=0; i< source.length; i++){
        let id = web3.utils.asciiToHex(source[i].replace(/['"]+/g,''), 32);
        source_id.push(id);
      }

      console.log("[addSource] source array: "+source_id)
      console.log("[addSource] calling addSource from account: "+accounts[0]);

      await instance.methods.addSource(author_id, image_id, source_id).send({ from: accounts[0], gas: 300000 });


      console.log("[addSource] saved to contract successfully, return to client")
      res.status(200).json({message:"Success"});
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log("[addSource] Ethereum saving to "+image+": "+error);
      res.status(500).json({message: error.toString()});
    }
  };
  callInstance();
});

//Given an artwork, add derivatives of it
artworkRoute.route('/addDer').post(function (req, res) {
  let author = req.body.author_id;
  let image = req.body.image_id;
  let der = req.body.derivative;

  const callInstance = async function() {
    try {
      // parse id from string to bytes32 for contract
      let author_id = web3.utils.asciiToHex(author.replace(/['"]+/g,''), 32);
      let image_id = web3.utils.asciiToHex(image.replace(/['"]+/g,''), 32);
      let der_id = [];

      for (var i=0; i< der.length; i++){
        let id = web3.utils.asciiToHex(der[i].replace(/['"]+/g,''), 32);
        der_id.push(id);
      }

      console.log("[addDerivative] calling addDerivative from account: "+accounts[0]);

      await instance.methods.addDerivative(author_id, image_id, der_id).send({ from: accounts[0], gas: 300000 });

      console.log("[addDerivative] saved to contract successfully, return to client")
      res.status(200).json({message:"Success"});
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log("[addSource] Ethereum saving to "+image+": "+error);
      res.status(500).json({message: error.toString()});
    }
  };
  callInstance();
});
//
//
// Temp
// artworkRoute.route('/addSource/:author/:image/:source').get(function (req, res) {
//   let author = req.params.author;
//   let image = req.params.image;
//   let source = req.params.source;
//
//   const callInstance = async function() {
//     try {
//       // parse id from string to bytes32 for contract
//       let author_id = web3.utils.asciiToHex(author.replace(/['"]+/g,''), 32);
//       let image_id = web3.utils.asciiToHex(image.replace(/['"]+/g,''), 32);
//       let source_id = web3.utils.asciiToHex(source.replace(/['"]+/g,''), 32);
//
//       console.log("[addSource] calling addSourcefrom account:"+accounts[0]);
//       await instance.methods.addSource(author_id, image_id, source_id).send({ from: accounts[0], gas: 300000 });
//
//       console.log("[addSource] saved to contract successfully, return to client")
//       res.status(200).json({message:"Success"});
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       console.log("[addSource] Ethereum saving to "+image+": "+error);
//       res.status(500).json({message: error.toString()});
//     }
//   };
//   callInstance();
//
// });

module.exports = artworkRoute;

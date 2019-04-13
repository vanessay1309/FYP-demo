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
let accounts, networkId, deployedNetwork, instance, balance;
const componentDidMount = async function() {
  try {
    // Use web3 to get the user's accounts.
    accounts = await web3.eth.getAccounts();

    //Let accounts[0] be default account and get balance
    await web3.eth.getBalance(accounts[0], (err, b) => {
      balance = b/(10**18);
    });

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

      // Retrieve artworks from Ethereum
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
            console.log("[retrieveAll] retrieved from Ethereum successfully, return to client");

            res.json(Json);


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
  let author_id = req.body.author_id;
  let name = req.body.name;
  let caption = req.body.caption;
  let access = req.body.access;
  let author = "";

  // Reject action if not enough ether
  if (balance < 10){
    console.log("[uploadArtwork] You dont have enough ETH to execute this action");
    res.status(500).json({message: "Not enough ETH"});
  }

  console.log("request: name"+name+","+"Access:"+access);
  console.log("author_id :"+author_id);



  //Find author name
  UserModel.findById(author_id, function(error, author){
    if (error){
      console.log("[uploadArtwork] Mongo retrieve user name error: "+error);
      res.status(500).json({message: error.toString()});
    }else{

      if (author == null){
        console.log("[uploadArtwork] cannot find author matching with given id");
        res.status(500).json({message: "Cannot find author"});
      }else{
        console.log("[uploadArtwork] retrieved user name from Mongo successfully, now retrieve from Ethereum");
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
                    console.log("[uploadArtwork] saved to contract successfully, return to client")
                    await instance.methods.addArtwork(author_id, image_id, name, caption, access).send({ from: accounts[0], gas: 300000 });

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
  let author_id = req.params.author;
  let image_id = req.params.image;
  let result = "";

  const callInstance = async function() {
    try {
      // parse id from string to bytes32 for contract
      let author_id32 = web3.utils.asciiToHex(author_id.replace(/['"]+/g,''), 32);
      let image_id32 = web3.utils.asciiToHex(image_id.replace(/['"]+/g,''), 32);

      const response = await instance.methods.retrieveArtworkInfo(author_id32, image_id32).call();
      console.log("[details] Mongo retrieve artwork successfully, now retrieve details of source and derivative");
      let sources = [];
      let derivatives = [];
      let sources32 = [];
      let derivatives32 = [];

      //retrieve source
      for (var i=0; i< response[5].length; i++){
        let source_iid = web3.utils.hexToUtf8(response[5][i]);
        await ArtworkModel.findById(source_iid, function(error, s){
          if (error){
            console.log("[details] Mongo get sources error: "+error);
            res.status(500).json({message: error.toString()});
          }else{
            let source_aid = JSON.stringify(s.author_id);
            // let a_id32 = web3.utils.asciiToHex(a_id.replace(/['"]+/g,''), 32);
            // let s_id32 = web3.utils.asciiToHex(s_id.replace(/['"]+/g,''), 32);
            sources32.push({'author_id': s.author_id, 'image_id': s._id,'name': s.name, 'author': s.author,'source_aid': source_aid,'source_iid': source_iid});
            }
          });
        }

        for (var i=0; i< sources32.length; i++){
          // let a_id32 = sources32[i].a_id32
          // let s_id32 = sources32[i].s_id32;
          let source_aid32 = web3.utils.asciiToHex(sources32[i].source_aid.replace(/['"]+/g,''), 32);
          let source_iid32 = web3.utils.asciiToHex(sources32[i].source_iid.replace(/['"]+/g,''), 32);
          const source = await instance.methods.retrieveArtwork(source_aid32, source_iid32).call();
          sources.push({'author_id': sources32[i].author_id, 'image_id': sources32[i].image_id, 'name': sources32[i].name, 'author': sources32[i].author, 'access': source[3]});
        }
      console.log("[details] retrieved sources from Mongo successfully")

      //retrieve derivatives
      for (var i=0; i< response[6].length; i++){
        let d_id = web3.utils.hexToUtf8(response[6][i]);
        await ArtworkModel.findById(d_id, function(error, d){
          if (error){
            console.log("[details] Mongo get sources error: "+error);
            res.status(500).json({message: error.toString()});
          }else{
            let a_id = JSON.stringify(d.author_id);
            // let a_id32 = web3.utils.asciiToHex(a_id.replace(/['"]+/g,''), 32);
            // let d_id32 = web3.utils.asciiToHex(d_id.replace(/['"]+/g,''), 32);
            derivatives32.push({'author_id': d.author_id, 'image_id': d._id,'name': d.name, 'author': d.author,'a_id': a_id,'d_id': d_id});
            }
          });
        }

        for (var i=0; i< derivatives32.length; i++){
          // let a_id32 = sources32[i].a_id32;
          // let d_id32 = sources32[i].d_id32;
          let der_aid32 = web3.utils.asciiToHex(derivatives32[i].a_id.replace(/['"]+/g,''), 32);
          let der_iid32 = web3.utils.asciiToHex(derivatives32[i].d_id.replace(/['"]+/g,''), 32);
          const der = await instance.methods.retrieveArtwork(der_aid32, der_iid32).call();
          derivatives.push({'author_id': derivatives32[i].author_id, 'image_id': derivatives32[i].image_id, 'name': derivatives32[i].name, 'author': derivatives32[i].author, 'access': der[3]});
        }
      console.log("[details] retrieved derivatives from Mongo successfully")



      result = {'author_id': web3.utils.hexToUtf8(response[0]), 'image_id': web3.utils.hexToUtf8(response[1]),'name': response[2], 'caption': response[3], 'access': response[4], 'sources': sources, 'derivatives': derivatives};

    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log("[details] getting from Ethereum artworks "+image_id+": "+error);
      res.status(500).json({message: error.toString()});
    }
  }

  const respond = callInstance().then(() => {
    console.log("[details] retrieve success, return to client")
    res.json(result);
  });
});

//Given an artwork, add sources of it
artworkRoute.route('/addSource').post(function (req, res) {
  let author_id = req.body.author_id;
  let image_id = req.body.image_id;
  let source_aid = req.body.source_aid;
  let source_iid = req.body.source_iid;

  const callInstance = async function() {
    try {
      // parse id from string to bytes32 for contract
      let author_id32 = web3.utils.asciiToHex(author_id.replace(/['"]+/g,''), 32);
      let image_id32 = web3.utils.asciiToHex(image_id.replace(/['"]+/g,''), 32);
      let source_aid32 = web3.utils.asciiToHex(source_aid.replace(/['"]+/g,''), 32);
      let source_iid32 = web3.utils.asciiToHex(source_iid.replace(/['"]+/g,''), 32);

      console.log("[addSource] calling from account: "+accounts[0]);

      res.json({message:"Success"});
      console.log("[addSource] success");

      await instance.methods.addSource(author_id32, image_id32, source_aid32, source_iid32).send({ from: accounts[0], gas: 300000 });


      // res.json({message:"Success"});
      // console.log("[addSource] success");
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log("[addSource] Ethereum saving to "+image_id+": "+error);
      res.status(500).json({message: error.toString()});
    }
  };
  callInstance();
});

module.exports = artworkRoute;

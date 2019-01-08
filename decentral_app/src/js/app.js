App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  //Array storing user_id at Arr[image_id]
  Mongo: [1,1],

  init: function() {
    return App.initWeb3();
  },

  //initWeb3() sources from truffleframework.com
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Gallery.json", function(gallery) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Gallery = TruffleContract(gallery);
      // Connect provider to interact with contract
      App.contracts.Gallery.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var galleryInstance;
    var loader = $("#loader");
    var all = $("#list");
    var one = $("#detail");
    var buttons = $("#options");

    loader.show();
    all.hide();
    buttons.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });


    // Load contract data
    App.contracts.Gallery.deployed().then(function(instance) {
      galleryInstance = instance;
      return galleryInstance.artworksCount();
    }).then(function(artworksCount) {
      var artworksResults = $("#artworkDisplay");
      artworksResults.empty();

      //Retrieve all artworks
      for (var i = 0; i < App.Mongo.length; i++) {
        galleryInstance.retrieveArtworkInfo.call(App.Mongo[i], i).then(function(gallery) {
          var user_id = gallery[0];
          var image_id = gallery[1];
          var name = gallery[2];
          var link = gallery[3];

          // Render artwork result
          var artworkDisplay = "<tr><th><img id='artwork' src='" + link + "' onClick='return App.display("+ user_id + "," + image_id + ");'></th><td>" + name + "</td></tr>";
          //var artworkDisplay = "<tr><th><img id='artwork' src='" + link + "></th><td>" + name + "</td><td></td><td></td></tr>";
          artworksResults.append(artworkDisplay);
        });
      }

      loader.hide();
      all.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  //Display details for a single art work
  display: function(user_id, image_id){
    var all = $("#list");
    var one = $("#detail");
    var buttons = $("#options");

    // Load artwork data
    App.contracts.Gallery.deployed().then(function(instance) {
      galleryInstance = instance;
      one.empty();

      //Retrieve previous artworks
        galleryInstance.retrievePrevious.call(user_id, image_id).then(function(gallery) {
          return gallery;

          // var artworkDisplay = "<h2> Previous artworks: ";
          //
          // // if (obj.length == 0) {
          // //   artworkDisplay = artworkDisplay + "none at the moment";
          // // }else{
          // //   for (var i = 0; i < obj.length; i++) {
          // //     //Validate and retrieve
          // //     var i_id = obj[i];
          // //     artworkDisplay = artworkDisplay + i_id;
          // //
          // //     galleryInstance.retrieveArtworkInfo.call(App.Mongo[i_id], i_id).then(function(one) {
          // //       var user_id = one[0];
          // //       var image_id = one[1];
          // //       var name = one[2];
          // //       var link = one[3];
          // //
          // //       // Render artwork result
          // //       artworkDisplay = artworkDisplay + "HI";
          // //       artworkDisplay = artworkDisplay + image_id;
          // //       //artworkDisplay = artworkDisplay + "<img id='artwork' src='" + link + "' onClick='return App.display("+ user_id + "," + image_id + ");'><p>" + name + "</p>";
          // //     });
          // //   }
          // // }
          //
          // artworkDisplay = artworkDisplay + "</h2>";
        }).then(function(images){

          var artworkDisplay = "<h2> Previous artworks: ";

          if (images.length == 0) {
            artworkDisplay = artworkDisplay + "none at the moment </h2>";
          }else{
            for (var i=0; i<images.length; i++){
              var i_id=images[i];
              artworkDisplay = artworkDisplay + "length=" +images.length;

              galleryInstance.retrieveArtworkInfo.call(1, 0).then(function(art) {
                // var user_id = one[0];
                // var image_id = one[1];
                var name = art[2];
                // var link = one[3];
                var wtf = "wth";
                one.append(name);
              });

              //artworkDisplay = artworkDisplay + "length=" +images.length+"function done";
            }
            //artworkDisplay = artworkDisplay + images[0] + " author= "+ App.Mongo[images[0]]+"</h2>";
          }
          one.append(artworkDisplay);
        });
    }).catch(function(error) {
      console.warn(error);
    });

    all.hide();
    one.show();
    buttons.show();
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


// document.getElementById('showAll').onclick=function(){
//   App.render();
// }

document.getElementById('back').onclick=function(){
  App.render();
}
//
// document.getElementById('track').onclick=function(){
//   var track_id = document.getElementById('trackWork').value;
//   App.track(track_id);
// }

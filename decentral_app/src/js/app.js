App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

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

      // array storing sample user_id and image_id
      var Arr=[[1,3],[1,2]];

      //Retrieve all artworks
      for (var i = 0; i < Arr.length; i++) {
        galleryInstance.retrieveArtworkInfo.call(Arr[i][0], Arr[i][1]).then(function(gallery) {
          var user_id = gallery[0];
          var image_id = gallery[1];
          var name = gallery[2];
          var link = gallery[3];

          // Render artwork result
          var artworkDisplay = "<tr><th><img id='artwork' src='" + link + "' onClick='return App.display("+ user_id + "," + image_id + ");'></th><td>" + name + "</td></tr>";
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
          var obj = gallery;
          var artworkDisplay = "<h2> Previous artworks: ";

          // Render artwork result
          if (obj.length == 0) {
            artworkDisplay = artworkDisplay + "none at the moment";
          }else{
            for (var i = 0; i < obj.length; i++) {
              artworkDisplay = artworkDisplay + obj[i];
            }
          }
          artworkDisplay = artworkDisplay + "</h2>";
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

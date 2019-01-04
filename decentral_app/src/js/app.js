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
    var content = $("#content");

    loader.show();
    content.hide();

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
        var user_id = Arr[i][0];
        var image_id = Arr[i][1];
        galleryInstance.retrieveArtwork.call(user_id, image_id).then(function(gallery) {
          var link = gallery[0];
          var name = gallery[1];
          var previous = gallery[2];
          var future = gallery[3];



          // Render candidate Result
          var artworkDisplay = "<tr><th>" + link + "</th><td>" + name + "</td><td>" + previous + "</td><td>" + future + "</td></tr>"
          artworksResults.append(artworkDisplay);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  track: function(track_id){
    alert("track work with image_id = "+track_id);
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
//
// function trytry(){
//   alert('hi');
// }


document.getElementById('showAll').onclick=function(){
  App.render();
}

document.getElementById('track').onclick=function(){
  var track_id = document.getElementById('trackWork').value;
  App.track(track_id);
}

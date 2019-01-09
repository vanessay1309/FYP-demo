App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  //Array storing user_id at Mongo[image_id]
  Mongo: [1,1,2,1],

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
      var artworksResults = $(".grid");
      artworksResults.empty();

      //Retrieve all artworks
      for (var i = 0; i < App.Mongo.length; i++) {
        galleryInstance.retrieveArtworkInfo.call(App.Mongo[i], i).then(function(gallery) {
          var user_id = gallery[0];
          var image_id = gallery[1];
          var name = gallery[2];
          var link = gallery[3];

          var artworksResults = $(".grid");
          var artworkDisplay = "<div class='cell'><img id='artwork' src='" + link + "' onClick='return App.display("+ user_id + "," + image_id + ", \""+ name + "\", \"" + link + "\");'><div class='mid'><div class='imageText'>"+name+"</div></div></div>" ;
          artworksResults.append(artworkDisplay);
        });
      }

      loader.hide();
      one.hide();
      all.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  //Display details for a single art work
  display: function(user_id, image_id, name, link){
    var all = $("#list");
    var one = $("#detail");
    var buttons = $("#options");

    one.empty();
    //sample, to be included in contract
    var description = "sample description.Lorem ipsum dolor sit amet, quas causae neglegentur ex quo. Ei pri delectus rationibus, ex accusam delectus conclusionemque pri.";

    var artInfo = "<div id='artProfile'><img src='"+link+"'><div id='text'><h2>" + name + "</h2><p>" + description + "</p></div></div>"
    one.append(artInfo);


    App.contracts.Gallery.deployed().then(function(instance) {
      galleryInstance = instance;

        galleryInstance.retrieveSource.call(user_id, image_id).then(function(gallery) {
          return gallery;
        }).then(function(images){

          //Retrieve previous artworks
          one.append("<div id='sources'></div>")
          var sources = $("#sources");
          sources.append("<h3> Sources: </h3>");

          if (images.length == 0) {
            sources.append("<p>none at the moment</p>");
          }else{
            sources.append("<div id='sourceItems' class='scrollwork'></div>");
            var scroll = $("#sourceItems");
            for (var i=0; i<images.length; i++){
              var i_id=images[i];
              galleryInstance.retrieveArtworkInfo.call(App.Mongo[i_id], i_id).then(function(art) {
                var user_id = art[0];
                var image_id = art[1];
                var name = art[2];
                var link = art[3];

                var displayEach = "<div class='scrollcell'><img id='artwork' src='" + link + "' onClick='return App.display("+ user_id + "," + image_id + ", \""+ name + "\", \"" + link + "\");'><div class='mid'><div class='imageText'>"+name+"</div></div></div>";
                scroll.append(displayEach);
              });
            }
          }
        });

        galleryInstance.retrieveDerivative.call(user_id, image_id).then(function(gallery) {
          return gallery;
        }).then(function(images){

          //Retrieve derivative work artworks
          one.append("<div id='derivatives'></div>")
          var derivatives = $("#derivatives");
          derivatives.append("<h3> Derivatives: </h3>");

          if (images.length == 0) {
            derivatives.append("<p>none at the moment</p>");
          }else{
            derivatives.append("<div id='derItems' class='scrollwork'></div>");
            var scroll = $("#derItems");
            for (var i=0; i<images.length; i++){
              var i_id=images[i];
              galleryInstance.retrieveArtworkInfo.call(App.Mongo[i_id], i_id).then(function(art) {
                var user_id = art[0];
                var image_id = art[1];
                var name = art[2];
                var link = art[3];

                var displayEach = "<div class='scrollcell'><img id='artwork' src='" + link + "' onClick='return App.display("+ user_id + "," + image_id + ", \""+ name + "\", \"" + link + "\");'><div class='mid'><div class='imageText'>"+name+"</div></div></div>";
                scroll.append(displayEach);
              });
            }
          }
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

document.getElementById('back').onclick=function(){
  App.render();
}

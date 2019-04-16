pragma solidity 0.5.0;

contract Gallery {
  // counter
  uint public artworksCount;

  struct Artwork {
    bytes32 hashValue;
    string name;
    string caption;
    string access;
    bytes32[] sources;
    bytes32[] derivatives;
  }

  // a hash table mapping hash(author_id, image_id) to Artwork
  mapping(bytes32 => Artwork) public gallery;

  constructor() public {
    addArtwork("5cb61c815fe5f3713d24ddbe", "5cb61b865fe5f3713d24ddbd", "Blue tones", "TW theatre", "https://res.cloudinary.com/fyp18003/image/upload/v1555438547/sample/1photo.jpg");
    addArtwork("5cb61a6a5fe5f3713d24ddba", "5cb61d345fe5f3713d24ddbf", "Galaxy", "My first piece!", "https://res.cloudinary.com/fyp18003/image/upload/v1555438579/sample/waterColour1.png");
    addArtwork("5cb61b445fe5f3713d24ddbc", "5cb61d675fe5f3713d24ddc0", "Dream lights","At disneyland", "https://res.cloudinary.com/fyp18003/image/upload/v1555438573/sample/photo1.jpg");
    addArtwork("5cb61b865fe5f3713d24ddbd", "5cb61df95fe5f3713d24ddc1", "My lovely cat", "No caption needed", "https://res.cloudinary.com/fyp18003/image/upload/v1555438546/sample/5photos.png");
    addArtwork("5cb61b095fe5f3713d24ddbb", "5cb61e715fe5f3713d24ddc2", "Spring is coming", "Red flower", "https://res.cloudinary.com/fyp18003/image/upload/v1555438560/sample/flower3.jpg");
    addArtwork("5cb618435fe5f3713d24ddb9", "5cb61ed35fe5f3713d24ddc3", "Dotted TW", "Taken at theatre", "https://res.cloudinary.com/fyp18003/image/upload/v1555439313/sample/dotsTW_pf5lkb.png");
    addArtwork("5cb61a6a5fe5f3713d24ddba", "5cb61f975fe5f3713d24ddc4", "Grumpy cat", "but still cute", "https://res.cloudinary.com/fyp18003/image/upload/v1555434511/sample/waterColour3_rz6y0k.jpg");
    addArtwork("5cb61b865fe5f3713d24ddbd", "5cb620135fe5f3713d24ddc6", "Dizzy", "Santurn", "https://res.cloudinary.com/fyp18003/image/upload/v1555438547/sample/3photo.jpg");
    addArtwork("5cb61b865fe5f3713d24ddbd", "5cb6203f5fe5f3713d24ddc7", "Cats and Cats", "new wallpaper", "https://res.cloudinary.com/fyp18003/image/upload/v1555438546/sample/6photospng.png");
    addArtwork("5cb61b865fe5f3713d24ddbd", "5cb620915fe5f3713d24ddc8", "New park", "Sunshine and breeze", "https://res.cloudinary.com/fyp18003/image/upload/v1555438550/sample/2photo.jpg");
    addArtwork("5cb61b095fe5f3713d24ddbb", "5cb620e25fe5f3713d24ddc9", "This morning", "Saw it on my hike","https://res.cloudinary.com/fyp18003/image/upload/v1555438561/sample/flower2.jpg");
    addArtwork("5cb618435fe5f3713d24ddb9", "5cb6212a5fe5f3713d24ddca", "Colourful world", "Weekend trip", "https://res.cloudinary.com/fyp18003/image/upload/v1555439912/sample/dotsPark_nifghb.png");
    addSource("5cb618435fe5f3713d24ddb9", "5cb61ed35fe5f3713d24ddc3","5cb61b865fe5f3713d24ddbd", "5cb61c815fe5f3713d24ddbe");
    addSource("5cb61a6a5fe5f3713d24ddba", "5cb61f975fe5f3713d24ddc4", "5cb61b865fe5f3713d24ddbd", "5cb61df95fe5f3713d24ddc1");
    addSource("5cb61b865fe5f3713d24ddbd", "5cb6203f5fe5f3713d24ddc7", "5cb61b865fe5f3713d24ddbd", "5cb61df95fe5f3713d24ddc1");
    addSource("5cb618435fe5f3713d24ddb9", "5cb6212a5fe5f3713d24ddca", "5cb61b865fe5f3713d24ddbd", "5cb620915fe5f3713d24ddc8");
  }

  function addArtwork (bytes32 author_id, bytes32 image_id, string memory _name, string memory caption, string memory access) public {
    artworksCount ++;
    bytes32[] memory s;
    bytes32[] memory d;
    bytes32 hashV = keccak256(abi.encodePacked(author_id, image_id));
    gallery[hashV] = Artwork(hashV, _name, caption, access, s, d);
  }
  function retrieveArtwork (bytes32 author_id, bytes32 image_id) public returns(bytes32, bytes32, string memory, string memory) {
      bytes32 hashV = keccak256(abi.encodePacked(author_id, image_id));
      return (author_id, image_id, gallery[hashV].name, gallery[hashV].access);
    }

  function retrieveArtworkInfo (bytes32 author_id, bytes32 image_id) public returns(bytes32, bytes32, string memory, string memory, string memory, bytes32[] memory, bytes32[] memory) {
    bytes32 hashV = keccak256(abi.encodePacked(author_id, image_id));
    return (author_id, image_id, gallery[hashV].name, gallery[hashV].caption, gallery[hashV].access, gallery[hashV].sources, gallery[hashV].derivatives);
  }

  function retrieveArtworkAccess (bytes32 author_id, bytes32 image_id) public returns(string memory) {
    bytes32 hashV = keccak256(abi.encodePacked(author_id, image_id));
    return (gallery[hashV].access);
  }


  function addSource (bytes32 author_id, bytes32 image_id, bytes32 source_aid, bytes32 source_iid ) public {
    bytes32 hashV = keccak256(abi.encodePacked(author_id, image_id));
    gallery[hashV].sources.push(source_iid);
    bytes32 source_hashV = keccak256(abi.encodePacked(source_aid, source_iid));
    gallery[source_hashV].derivatives.push(image_id);
  }

}

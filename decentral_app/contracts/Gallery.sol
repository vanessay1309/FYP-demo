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

  // Read/write Artwork
  // a hash table mapping hash(author_id, image_id) to Artwork
  mapping(bytes32 => Artwork) public gallery;


  constructor() public {
    //Data for contract to be in sync with Mongo
    addArtwork("5ca5ec14a5ef65243d180a71", "5ca5ef821845d7248e9615fc", "kitten2", "cute cat from my home", "https://res.cloudinary.com/fyp18003/image/upload/v1554541663/artworks/kitten2.jpg");
    addArtwork("5ca5ec2fa5ef65243d180a72", "5ca5f2e33ceec224c919f7ed", "Boxer", "funny dog from my neighbor", "https://res.cloudinary.com/fyp18003/image/upload/v1554541663/artworks/boxer.jpg");
    addArtwork("5ca5ec2fa5ef65243d180a72", "5ca5f3103ceec224c919f7ee", "golden-retriever", "gold dog", "https://res.cloudinary.com/fyp18003/image/upload/v1554541663/artworks/golden-retriever.jpg");
    addArtwork("5ca5ec2fa5ef65243d180a72", "5ca5f55272595c24ddf8a35c", "kitten3", "unique one ", "https://res.cloudinary.com/fyp18003/image/upload/v1554541663/artworks/kitten3.jpg");
    addSource("5ca5ec2fa5ef65243d180a72", "5ca5f55272595c24ddf8a35c", "5ca5ec2fa5ef65243d180a72", "5ca5f55272595c24ddf8a35c");
    /* addSource("5ca5ec14a5ef65243d180a71", "5ca5ef821845d7248e9615fc", "5ca5f55272595c24ddf8a35c");
    addSource("5ca5ec14a5ef65243d180a71", "5ca5ef821845d7248e9615fc", "5ca5f3103ceec224c919f7ee");
    addSource("5ca5ec14a5ef65243d180a71", "5ca5ef821845d7248e9615fc", "5ca5f2e33ceec224c919f7ed"); */
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
    gallery[source_hashV].derivatives.push(source_iid);
  }

}

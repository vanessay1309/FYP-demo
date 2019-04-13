pragma solidity 0.5.0;

contract Gallery {
  // counter
  uint public artworksCount;

  struct Artwork {
    bytes32 hashValue;
    string name;
    string caption;
    string access;
    bytes32[] source;
    bytes32[] derivative;
  }

  // Read/write Artwork
  // a hash table mapping hash(user_id, image_id) to Artwork
  mapping(bytes32 => Artwork) public gallery;


  constructor() public {
    //Data for contract to be in sync with Mongo
    addArtwork("5ca5ec14a5ef65243d180a71", "5ca5ef821845d7248e9615fc", "kitten2", "cute cat from my home", "https://res.cloudinary.com/fyp18003/image/upload/v1554541663/artworks/kitten2.jpg");
    addArtwork("5ca5ec2fa5ef65243d180a72", "5ca5f2e33ceec224c919f7ed", "Boxer", "funny dog from my neighbor", "https://res.cloudinary.com/fyp18003/image/upload/v1554541663/artworks/boxer.jpg");
    addArtwork("5ca5ec2fa5ef65243d180a72", "5ca5f3103ceec224c919f7ee", "golden-retriever", "gold dog", "https://res.cloudinary.com/fyp18003/image/upload/v1554541663/artworks/golden-retriever.jpg");
    addArtwork("5ca5ec2fa5ef65243d180a72", "5ca5f55272595c24ddf8a35c", "kitten3", "unique one ", "https://res.cloudinary.com/fyp18003/image/upload/v1554541663/artworks/kitten3.jpg");
    addSource("5ca5ec14a5ef65243d180a71", "5ca5ef821845d7248e9615fc", "5ca5f55272595c24ddf8a35c");
    addSource("5ca5ec14a5ef65243d180a71", "5ca5ef821845d7248e9615fc", "5ca5f3103ceec224c919f7ee");
    addSource("5ca5ec14a5ef65243d180a71", "5ca5ef821845d7248e9615fc", "5ca5f2e33ceec224c919f7ed");
  }

  function addArtwork (bytes32 user_id, bytes32 image_id, string memory _name, string memory caption, string memory access) public {
    artworksCount ++;
    bytes32[] memory p;
    bytes32[] memory f;
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV] = Artwork(hashV, _name, caption, access, p, f);
  }

  function retrieveArtworkInfo (bytes32 u_id, bytes32 i_id) public returns(bytes32, bytes32, string memory, string memory, string memory, bytes32[] memory, bytes32[] memory) {
    bytes32 hashV = keccak256(abi.encodePacked(u_id, i_id));
    return (u_id, i_id, gallery[hashV].name, gallery[hashV].caption, gallery[hashV].access, gallery[hashV].source, gallery[hashV].derivative);
  }

  function retrieveArtworkAccess (bytes32 u_id, bytes32 i_id) public returns(string memory) {
    bytes32 hashV = keccak256(abi.encodePacked(u_id, i_id));
    return (gallery[hashV].access);
  }


  function addSource (bytes32 u_id, bytes32 i_id, bytes32 s_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(u_id, i_id));
    gallery[hashV].source.push(s_id);
  }

  function addDerivative (bytes32 u_id, bytes32 i_id, bytes32 d_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(u_id, i_id));
    gallery[hashV].derivative.push(d_id);
  }

}

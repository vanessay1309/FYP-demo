pragma solidity 0.5.0;
pragma experimental ABIEncoderV2;

contract Gallery {
  // counter
  uint public artworksCount;

  struct Artwork {
    bytes32 hashValue;
    string name;
    string access;
    //store other works in form of image_id that references to Mongo
    uint[] previousA;
    uint[] futureA;
  }

  // Read/write Artwork
  // a hash table mapping hash(user_id, image_id) to Artwork
  mapping(bytes32 => Artwork) public gallery;


  constructor() public {
    addArtwork("daVinci", 1, 3);
    addArtwork("MonaLisa", 1, 2);
  }

  function addArtwork (string memory _name, uint user_id, uint image_id) public {
    artworksCount ++;
    uint[] memory previous;
    uint[] memory future;
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV] = Artwork(hashV, _name, "12345", previous, future);
  }

  function retrieveArtwork (uint user_id, uint image_id) public returns(Artwork memory a) {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return gallery[hashV];
  }

  function retrieveArtworkName (uint user_id, uint image_id) public returns(string memory a) {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return gallery[hashV].name;
  }
}

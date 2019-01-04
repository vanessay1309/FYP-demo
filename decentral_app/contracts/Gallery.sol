pragma solidity 0.5.0;
pragma experimental ABIEncoderV2;

contract Gallery {
  // counter
  uint public artworksCount;

  struct Artwork {
    bytes32 hashValue;
    string name;
    string accessL;
    //store other works in form of image_id that references to Mongo
    uint[] previous;
    uint[] future;
  }

  // Read/write Artwork
  // a hash table mapping hash(user_id, image_id) to Artwork
  mapping(bytes32 => Artwork) public gallery;


  constructor() public {
    addArtwork("daVinci","./dV.jpg", 1, 3);
    addArtwork("MonaLisa","./mL.jpg", 1, 2);
  }


  function addArtwork (string memory _name, string memory accessL, uint user_id, uint image_id) public {
    artworksCount ++;
    uint[] memory p;
    uint[] memory f;
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV] = Artwork(hashV, _name, accessL, p, f);
  }

  function retrieveArtwork (uint user_id, uint image_id) public returns(string memory _name, string memory accessL, uint[] memory previous, uint[] memory future) {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return (gallery[hashV].name, gallery[hashV].accessL, gallery[hashV].previous, gallery[hashV].future) ;
  }

  function retrieveArtworkName (uint user_id, uint image_id) public returns(string memory a) {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return gallery[hashV].name;
  }

  function addPrevious (uint user_id, uint image_id, uint previous_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV].previous.push(previous_id);
  }

  function retrievePrevious (uint user_id, uint image_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV].previous;
  }

  function addFuture (uint user_id, uint image_id, uint future_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV].future.push(future_id);
  }

  function retrieveFuture (uint user_id, uint image_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV].future;
  }



}

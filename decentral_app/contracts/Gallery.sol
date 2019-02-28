pragma solidity 0.5.0;

contract Gallery {
  // counter
  uint public artworksCount;

  struct Artwork {
    bytes32 hashValue;
    string name;
    string accessL;
    //store other works in form of image_id that references to Mongo
    uint[] source;
    uint[] derivative;
  }

  // Read/write Artwork
  // a hash table mapping hash(user_id, image_id) to Artwork
  mapping(bytes32 => Artwork) public gallery;


  constructor() public {
    addArtwork("daVinci","images/boxer.jpeg", 1, 0);
    addArtwork("MonaLisa","images/golden-retriever.jpeg", 1, 1);
    addArtwork("Paris", "images/french-bulldog.jpeg", 2, 2);
    addArtwork("Boxer", "images/scottish-terrier.jpeg", 1, 3);
    addSource(1,0,1);
    addSource(1,0,2);
    addSource(1,0,3);
    addDerivative(2,2,3);
    addDerivative(1,1,3);
  }


  function addArtwork (string memory _name, string memory accessL, uint user_id, uint image_id) public {
    artworksCount ++;
    uint[] memory p;
    uint[] memory f;
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV] = Artwork(hashV, _name, accessL, p, f);
  }

  function retrieveArtwork (uint user_id, uint image_id) public returns(uint i_id, string memory _name, string memory accessL, uint[] memory source, uint[] memory derivative) {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return (image_id, gallery[hashV].name, gallery[hashV].accessL, gallery[hashV].source, gallery[hashV].derivative) ;
  }

  function retrieveArtworkInfo (uint user_id, uint image_id) public returns(uint u_id, uint i_id,string memory a, string memory accessL) {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return (user_id, image_id, gallery[hashV].name, gallery[hashV].accessL);
  }

  function addSource (uint user_id, uint image_id, uint source_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV].source.push(source_id);
  }

  function retrieveSource (uint user_id, uint image_id) public returns(uint[] memory source){
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return gallery[hashV].source;
  }

  function addDerivative (uint user_id, uint image_id, uint der_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV].derivative.push(der_id);
  }

  function retrieveDerivative (uint user_id, uint image_id) public returns (uint[] memory derivative) {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return gallery[hashV].derivative;
  }



}

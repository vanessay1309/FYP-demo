pragma solidity 0.5.0;

contract Gallery {
  // counter
  uint public artworksCount;

  struct Artwork {
    bytes32 hashValue;
    string name;
    string access;
    //store other works in form of image_id that references to Mongo
    bytes32[] source;
    bytes32[] derivative;
  }

  // Read/write Artwork
  // a hash table mapping hash(user_id, image_id) to Artwork
  mapping(bytes32 => Artwork) public gallery;


  constructor() public {
    /* addArtwork("daVinci","images/boxer.jpeg", 1, 0);
    addArtwork("MonaLisa","images/golden-retriever.jpeg", 1, 1);
    addArtwork("Paris", "images/french-bulldog.jpeg", 2, 2);
    addArtwork("Boxer", "images/scottish-terrier.jpeg", 1, 3); */
    addArtwork("work by tessa", "images/scottish-terrier.jpeg", "5c765815c8dd530a9f247b4b", "5c76586ec8dd530a9f247b4e");
    addArtwork("work by alan", "images/scottish-terrier.jpeg", "5c765823c8dd530a9f247b4c", "5c76588dc8dd530a9f247b4f");
    /* addArtwork("another by Tessa", "images/scottish-terrier.jpeg", "5c765815c8dd530a9f247b4b", "5c7d2969a120220604f1b6ef");
    addArtwork("another by Tessa", "hihi", "5c165815c8dd530a9f247b4b", "5c7d2960a120220604f1b6ef"); */
    /* addSource(1,0,1);
    addSource(1,0,2);
    addSource(1,0,3);
    addDerivative(2,2,3);
    addDerivative(1,1,3); */
  }

  function addArtwork (string memory _name, string memory access, bytes32 user_id, bytes32 image_id) public {
    artworksCount ++;
    bytes32[] memory p;
    bytes32[] memory f;
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV] = Artwork(hashV, _name, access, p, f);
  }

  function retrieveArtwork (bytes32 u_id, bytes32 i_id) public returns(bytes32, bytes32, string memory, string memory) {
    bytes32 hashV = keccak256(abi.encodePacked(u_id, i_id));
    return (u_id, i_id, gallery[hashV].name, gallery[hashV].access);
  }

  function retrieveArtworkInfo (bytes32 u_id, bytes32 i_id) public returns(bytes32, bytes32, string memory, string memory, bytes32[] memory, bytes32[] memory) {
    bytes32 hashV = keccak256(abi.encodePacked(u_id, i_id));
    return (u_id, i_id, gallery[hashV].name, gallery[hashV].access, gallery[hashV].source, gallery[hashV].derivative);
  }

  function addSource (bytes32 u_id, bytes32 i_id, bytes32[] memory s_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(u_id, i_id));
    for (uint i=0; i<s_id.length; i++) {
      gallery[hashV].source.push(s_id[i]);
    }
  }

  function addDerivative (bytes32 u_id, bytes32 i_id, bytes32[] memory d_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(u_id, i_id));
    for (uint i=0; i<d_id.length; i++) {
      gallery[hashV].derivative.push(d_id[i]);
    }
  }

/*
  function retrieveSource (string memory user_id, string memory image_id) public returns(uint[] memory source){
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return gallery[hashV].source;
  }

  function addDerivative (string memory user_id, string memory image_id, uint der_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV].derivative.push(der_id);
  }

  function retrieveDerivative (string memory user_id, string memory image_id) public returns (uint[] memory derivative) {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return gallery[hashV].derivative;
  } */



}

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


  function addArtwork (string memory _name, string memory accessL, string memory user_id, string memory image_id) public {
    artworksCount ++;
    uint[] memory p;
    uint[] memory f;
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV] = Artwork(hashV, _name, accessL, p, f);
  }

  // function retrieveArtwork (string memory user_id, string memory image_id) public returns(string memory i_id, string memory _name, string memory accessL, uint[] memory source, uint[] memory derivative) {
  //   bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
  //   return (image_id, gallery[hashV].name, gallery[hashV].accessL, gallery[hashV].source, gallery[hashV].derivative) ;
  // }

  /* function retrieveArtworkInfo (string memory user_id, string memory image_id) public returns(string memory u_id, string memory i_id,string memory a, string memory accessL) {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    return (user_id, image_id, gallery[hashV].name, gallery[hashV].accessL);
  } */
  function retrieveArtworkInfo (string memory u_id, string memory i_id) public returns(string memory, string memory,string memory, string memory) {
    bytes32 hashV = keccak256(abi.encodePacked(u_id, i_id));
    return (u_id, i_id, gallery[hashV].name, gallery[hashV].accessL);
  }

  /* function addSource (string memory user_id, string memory image_id, string memory source_id) public {
    bytes32 hashV = keccak256(abi.encodePacked(user_id, image_id));
    gallery[hashV].source.push(source_id);
  }

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

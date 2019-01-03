pragma solidity 0.5.0;

contract Upload {
  string public candidate;
  struct Artwork {
    uint id;
    string name;
    uint voteCount;
  }

  // Read/write Artwork
  // a hash table mapping id to artwork
  mapping(uint=>Artwork) public artworks;

  // counter
  uint public artworksCount;


  constructor() public {
    addArtwork("daVinci");
    addArtwork("MonaLisa");
  }

  function addArtwork (string memory _name) private {
    artworksCount ++;
    artworks[artworksCount] = Artwork(artworksCount, _name, 0);
  }
}

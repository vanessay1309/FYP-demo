pragma solidity 0.4.24;

contract Election {
  struct Candidate {
      uint id;
      string name;
      uint voteCount;
  }

  //Solidity mapping: associates key(uint)-value(Candidate) pair
  mapping(uint => Candidate) public candidates;

  // Store Candidates Count since there is no way to know size of mapping in Solidity
  uint public candidatesCount;

  //constructor, initiate two candidates
  constructor() public {
      addCandidate("Candidate 1");
      addCandidate("Candidate 2");
  }

  function addCandidate (string _name) private {
    candidatesCount ++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
  }


}

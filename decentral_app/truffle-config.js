var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'YOUR WALLET KEY';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider("tissue recipe oblige swim cement fog gain waste royal mouse chalk palace", "https://ropsten.infura.io/f16eae85e7814770818da8ae2a8e3631")
      },
      network_id: 3,
      gas: 4000000
    }
  }
};

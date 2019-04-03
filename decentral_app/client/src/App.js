import React, { Component } from "react";
import GalleryContract from "./contracts/Gallery.json";
import getWeb3 from "./utils/getWeb3";

// import Menu from "./js/demo";

import "./App.css";
import "./css/style.css";
// import  "./css/bootstrap.min.css";
class App extends Component {
  state = { name: null, web3: null, accounts: null, contract: null };

  async componentDidMount() {
    try {
      document.title = "Crypto Gallery";
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GalleryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        GalleryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    // temporary comment any code that refers to galleryContract.state
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.addArtwork("abc", "abc","5c765815c8dd530a9f247b2b","5c76586ec8dd530a9f247b4e").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.retrieveArtworkInfo("5c765815c8dd530a9f247b4b", "5c76586ec8dd530a9f247b4e").call();

    // Update state with the result.
    this.setState({ name: response[2] });  };

  render() {
    // if (!galleryContract.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          the name of artwork of (1,0).
        </p>
        <p>
          Try changing the value stored on <strong>line 45</strong> of App.js.
        </p>
         <div>The name of artwork is: {this.state.name}</div>


         //original webpage
      <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript">
         </script>

         <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
           <link rel="stylesheet" href="css/style.css"/>
      <div className="w3-content" style={{maxWidth:'1200px', paddingBottom:'80px'}}>
        <div className="w3-panel w3-center w3-opacity" style={{padding:'10px 16px'}}>
            <h1 className="text-center">Crypto Gallery</h1>
            <hr/>
        </div>
            <div id="loader">
              <p className="text-center">Loading...</p>
            </div>
            <div id="list">
              <div className="grid">

              </div>
            </div>
            <div id="detail" style={{display:'none'}}>
            </div>
            <div id="options">
              <input id="back" type="button" value="back" style={{display:'inline'}}/>
            </div>

          <div id="uploadContent">
        
            <p className="text-left">Upload Content</p>
            <button className="text-left" >Upload</button>
          </div>


        </div>
        <div className="footer">
          <p id="accountAddress" className="text-center"></p>
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/web3.min.js"></script>
  </div>

    );
  }
}

export default App;

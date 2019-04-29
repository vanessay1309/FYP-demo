import React, { Component } from "react";
class About extends Component {
  render() {
    return(
      <div className="About">
        <h1>Decentralised Media Sharing platform</h1>
        <section className = "Objective">
        <h1>Our Goal:</h1>
        <p>The application makes use of blockchain's immutabiltiy and traceability to create a platform that can better protect copyright and fair use of media by providing secure storage and usage tracking.
        It aims to preserve the originality of the artwork by validating the proof of work during uploading.</p>
        </section>
        <section className = "Features">
        <h1>Features:</h1>
        <div id="concept"><img src="https://res.cloudinary.com/fyp18003/image/upload/v1556488645/Other/Feature.png"/></div>
        </section>
        <section className = "System">
        <h1>System Architecture:</h1>
        <div id="conceptS"><img src="https://res.cloudinary.com/fyp18003/image/upload/v1556490947/Other/system.png"/></div>

            <p>The application heavily relies on web3.js to manage the communication between web application and Ethereum.
            Via the digital wallet MetaMask, web3 can interact with smart contracts depoyed on the local Ethereum or Ropsten test network.</p>

        </section>

      </div>
    );
  }
}
export default About;

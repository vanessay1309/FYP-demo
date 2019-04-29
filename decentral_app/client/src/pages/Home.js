import React, { Component } from "react";
import Header from '../components/Header';
class Home extends Component {
  render() {
    return(
      <div className="Home">
        <Header/>
        <div id="Hcontent">
        <div id="content">
        <h1>This is Agora, the digital artwork sharing platform that you can upload any artwork via your MetaMask Wallet</h1>
        Your upload history would be stored in the blockchain which secure the proof to your artwork.
        </div>
        <section>
        <img src = "https://res.cloudinary.com/fyp18003/image/upload/v1556504433/Other/Group_2.png"/>
        </section>
        </div>
      </div>
    );
  }
}
export default Home;
// <section>
//
// <img id="flow" src = "https://res.cloudinary.com/fyp18003/image/upload/v1556504433/Other/Group.png"/>
// One Wallet,
// </section>

import React, { Component } from "react";
import Header from '../components/Header';
class Home extends Component {
  render() {
    return(
      <div className="Home">
        <Header/>
        <h1>Home</h1>
        <h1>Hello, Welcome to Agora!</h1>
        <img src = "https://res.cloudinary.com/fyp18003/image/upload/v1556504433/Other/Group.png"/>
        <img src = "https://res.cloudinary.com/fyp18003/image/upload/v1556504433/Other/Group_2.png"/>
      </div>
    );
  }
}
export default Home;

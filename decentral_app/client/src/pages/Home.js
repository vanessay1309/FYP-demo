import React, { Component } from "react";
import Header from '../components/Header';
class Home extends Component {
  render() {
    return(
      <div className="Home">
        <Header/>
        <h1>Home</h1>
        <h1>Hello, Welcome to Agora!</h1>
      </div>
    );
  }
}
export default Home;

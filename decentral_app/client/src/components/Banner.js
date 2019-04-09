import React, { Component } from "react";

class Banner extends Component {
  render() {
    return(
      <div>
      <link rel="stylesheet" href="css/banner.css"/>
      <section id="welcome-page" className="welcome-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="header-text">
                <h1> Welcome to </h1>
                  <h2> Agora </h2>

                <p>a creative content sharing platform with the use of blockchain technology</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>
          );
  }
}
export default Banner;

// <img className="svg-big" src={require("../images/welcome-banner.jpg")} width="{100%}" height="{50px}"/>

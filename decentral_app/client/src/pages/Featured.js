import React, { Component } from "react";
import "../css/featuredArtwork.css";
class Featured extends Component {
  render() {
    return(
      <div className="Featured">

        <h1>Featured Artworks</h1>

        <section>

        <div className="row">
          <div className="column">
            <img src="https://www.w3schools.com/w3images/wedding.jpg"  />
            <img src="https://www.w3schools.com/w3images/rocks.jpg"  />
            <img src="https://www.w3schools.com/w3images/falls2.jpg"  />
            <img src="https://www.w3schools.com/w3images/paris.jpg"  />
            <img src="https://www.w3schools.com/w3images/nature.jpg"  />
            <img src="https://www.w3schools.com/w3images/mist.jpg"  />
            <img src="https://www.w3schools.com/w3images/paris.jpg"  />
          </div>
          <div className="column">
            <img src="https://www.w3schools.com/w3images/underwater.jpg"  />
            <img src="https://www.w3schools.com/w3images/ocean.jpg"  />
            <img src="https://www.w3schools.com/w3images/wedding.jpg"  />
            <img src="https://www.w3schools.com/w3images/mountainskies.jpg"  />
            <img src="https://www.w3schools.com/w3images/rocks.jpg"  />
            <img src="https://www.w3schools.com/w3images/underwater.jpg"  />
          </div>
          <div className="column">
            <img src="https://www.w3schools.com/w3images/wedding.jpg"  />
            <img src="https://www.w3schools.com/w3images/rocks.jpg"  />
            <img src="https://www.w3schools.com/w3images/ocean.jpg"  />
            <img src="https://www.w3schools.com/w3images/wedding.jpg"  />
            <img src="https://www.w3schools.com/w3images/mountainskies.jpg"  />
            <img src="https://www.w3schools.com/w3images/mist.jpg"  />
            <img src="https://www.w3schools.com/w3images/paris.jpg"  />
          </div>
          <div className="column">
            <img src="https://www.w3schools.com/w3images/underwater.jpg"  />
            <img src="https://www.w3schools.com/w3images/rocks.jpg"  />
            <img src="https://www.w3schools.com/w3images/underwater.jpg"  />
          </div>
        </div>
        </section>

      </div>
    );
  }
}
export default Featured;

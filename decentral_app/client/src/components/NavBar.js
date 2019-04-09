import React, { Component } from "react";

import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
class NaviBar extends Component {
  render() {
    return(
      <div id="navbar">
      <nav>

      Navigation Bar

      <ul>

        <li><Link exact activeClassName="current" to='/about'>About</Link></li>
        <li><Link exact activeClassName="current" to='/gallery'>Artwork</Link></li>
        <li>Author</li>
        <li><Link exact activeClassName="current" to='/upload'>Upload Artwork</Link></li>

        <li> Login/Sign In </li>
      </ul>


      </nav>
      </div>

    );
  }
}
export default NaviBar;

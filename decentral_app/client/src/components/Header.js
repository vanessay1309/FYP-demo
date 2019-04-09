import React, { Component } from "react";
import Banner from './Banner';
import NavBar from './NavBar';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
class Header extends Component {
  render() {
    return(
      <div>
        <Banner />
            </div>

  );
  }
}
export default Header;

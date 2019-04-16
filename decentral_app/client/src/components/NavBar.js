import React, { Component } from "react";

import {
  BrowserRouter,
   NavLink,
  Route,
  Switch,
} from 'react-router-dom';
class NaviBar extends Component {

  async componentDidMount(){
    console.log ("componentDidMount: \nisMember:"+this.props.isMember);
  }


  render()


  {
    return(
      <div id="navbar">
      <nav>

      Navigation Bar

      <ul>
        <li>< NavLink  activeClassName="current" to='/about'>About</ NavLink></li>
        <li>< NavLink  activeClassName="current" to='/featured'>Featured</ NavLink></li>
        <li>< NavLink  activeClassName="current" to='/gallery'>Artwork</ NavLink></li>
        <li>< NavLink  activeClassName="current" to='/author'>Author</NavLink></li>
        {this.props.isMember && <li>< NavLink  activeClassName="current" to='/upload'>Upload Artwork</ NavLink></li>
        }
        <li> < NavLink  activeClassName="current" to='/signin' > Login/Sign In </ NavLink></li>
      </ul>


      </nav>
      </div>

    );
  }
}
export default NaviBar;

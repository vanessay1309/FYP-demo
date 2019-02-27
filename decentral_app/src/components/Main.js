import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// Our all component files
import ListUser from '../components/ListUser';
import AddUser from '../components/AddUser';
import EditUser from '../components/EditUser';

class Main extends Component {

render() {
return (
<main>
<Switch>
<Route exact path='/' component={ListUser} />
<Route path='/list' component={ListUser} />
<Route path='/adduser' component={AddUser} />
<Route path='/edituser/:id' component={EditUser} />
</Switch>
</main>
);
}
}

export default Main;

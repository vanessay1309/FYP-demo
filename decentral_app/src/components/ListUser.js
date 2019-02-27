import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
// To use routing functionalities
import { Link } from 'react-router-dom';
import '../index.css';
import UserService from './Services';

var divStyle = {
margin: '8% 8%',
};

class ListUser extends Component {

  constructor(props) {
  super(props);
  this.userService = new UserService();
  this.state = {
  users: []
  }
  this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount = () => {
  this.getUserList();
  }

  // To get all the users
  getUserList() {
    axios.get('http://localhost:4000/users')
    .then((response) => {
      console.log(response);
      this.setState({
        users: response.data
      });
    }).catch((error) => {
      console.log(error);
    })
  }

  // To delete any user
  deleteUser(empid) {
  this.userService.deleteUser(empid);
  this.getUserList();
  }

  render() {
  const { users } = this.state;
  return (
  <div style={divStyle}>
  <Table responsive>
  <thead>
  <tr>
  <th>#</th>
  <th>First Name</th>
  <th>Last Name</th>
  <th>Email</th>
  <th>Phone</th>
  <th></th>
  <th></th>
  </tr>
  </thead>
  <tbody>
  {
  users && users.map((user, i) => {
  return (
  <tr key={i}>
  <td>{i}</td>
  <td>{user.firstName}</td>
  <td>{user.lastName}</td>
  <td>{user.email}</td>
  <td>{user.phone}</td>
  <td>
  <Link to={"edituser/" + user._id} className="btn btn-primary">Edit</Link>
  </td>
  <td>
  <Button onClick={() => this.deleteUser(user._id)} bsStyle="danger" >Delete</Button>
  </td>
  </tr>
  )
  })
  }
  </tbody>
  </Table>
  </div>
  );
  }
}

export default ListUser;

import React, { Component } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import Form from "../components/Form"
class SignInForm extends Component {
  constructor(props){
    super(props);
    this.state={
      author_name:null,
      bio:null,
      avatar:null
    }
  }

  handleNameChange(event){
    event.preventDefault();
    this.setState({img_name : event.target.value});
    console.log('Your caption is', event.target.value);
  }

  handleCaptionChange(event){

    event.preventDefault();

   this.setState({img_caption : event.target.value});
   console.log('Your caption is', event.target.value);
  }

  submitHandler(){
      console.log("Submit Handler");
      console.log("Submit Handler : cloud config");

  }
  render() {
    return(


      <div className ="signIn">
        <h1>Form</h1>

        <Form />
      </div>

  );
  }
}
export default SignInForm;

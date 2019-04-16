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
      avatar:null,
      isInfoLoaded:false
      };
      this.handleImageAddressInput = this.handleImageAddressInput.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleBioChange = this.handleBioChange.bind(this);
      this.submitHandler = this.submitHandler.bind(this);
    }

  handleNameChange(event){
    event.preventDefault();
    this.setState({author_name : event.target.value});
    console.log('Your caption is', event.target.value);
  }

  handleBioChange(event){

    event.preventDefault();

   this.setState({bio : event.target.value});
   console.log('Your caption is', event.target.value);
  }

  submitHandler(){
      console.log("Submit Handler");
      console.log("Submit Handler : cloud config");

  }

  handleImageAddressInput(event){
    let reader = new FileReader();
    let file = event.target.files[0];
    let img_loc = event.target.value;
        let uploadPreset= "tt3uhkl0";
      event.preventDefault();

      if(img_loc){
        console.log("image loaded ");
        reader.onloadend = () =>{
          this.setState({img_data : reader.result, img_loc:img_loc});


          console.log("Submit Handler: image adress is : " + this.state.img_loc);
        }

            reader.readAsDataURL(file);

            console.log("image local : "+ img_loc);

        }
      else{
        console.log("image empty " );
        this.setState({img_data :'', img_loc :img_loc });
      }

      console.log("Submit Handler: image adress is : " + this.state.img_loc);
      // let  api_sign_request = function(params_to_sign,api_secret);
      //cloudinary upload
    }


    // Check input box content
    IsInfoLoad(){
      if(this.state.author_name != "" && this.state.bio != ""){
          this.setState({isInfoLoaded:true});
      }
      else{
        this.setState({isInfoLoaded:false});
      }
    }


  render() {
    let $imagePreview = null;
    if(this.state.img_loc){
      $imagePreview =(<img id="image_preview" src={this.state.img_data} alt="image preview" />);
    }else{
      $imagePreview=  (<img id="image_preview" value=" Your image preview Here" />);
    }

    return(
      <div className ="signIn">
        <h1>Sign In Form </h1>
        <form>
          <div id="name">
            <label for="name">
            Name:
            </label>
            <input id = "name" type="text" placeholder="type name of the artwork here.." value={this.state.author_name} onChange={this.handleNameChange} required/>
          </div>
          <div id="bio">
            <label for="bio">
            Biography:
            </label>
            <textarea id = "bio" type="text" cols="20" rows="5" placeholder="type bio here.." value={this.state.bio} onChange={this.handleBioChange} required/>
          </div>
          <div id="avatar">
            <label for="avatar">
            Avatar:
            </label>
            <input id="avatar" type='file' id="imgInput" accept=".jpg,.jpeg,.png"  onChange={ this.handleImageAddressInput} />
              {$imagePreview}
          </div>
        </form>
      </div>

  );
  }
}
export default SignInForm;

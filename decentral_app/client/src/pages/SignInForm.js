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
      author_name:'',
      bio:'',
      avatar:'',
      isInfoLoaded:false
      };
      this.handleImageAddressInput = this.handleImageAddressInput.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleBioChange = this.handleBioChange.bind(this);
      this.submitHandler = this.submitHandler.bind(this);
      this.Register = this.Register.bind(this);
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


    // update user info
async   Upload(){

              let cloudName="fyp18003";
              let uploadPreset= "tt3uhkl0";
              // notification for entire upload process
              let isUploaded = false;
              let  accessL,public_id,signature;

              //determine the storage folder
              let folder = "avatar";


              console.log("uploading to cloudinary, cloudName:"+ cloudName+" uploadPreset:"+uploadPreset);
              // let  api_sign_request = function(params_to_sign,api_secret);

              //cloudinary widget call
              let cloudStorage = window.cloudinary.createUploadWidget({
                cloudName:cloudName ,
                uploadPreset: uploadPreset,
                folder:folder,
                // use_filename:true,
                resourceType:"image",
                clientAllowedFormats: "jpg,png"
              }, (error, result) => {
                //success --> retrieve artwork info, url
                if (result.event === "success") {

                  this.state.avatar = result.info.secure_url;
                  // console.log("201 Upload Success to Cloud: access :"+ this.state.accessL +"\n public_id: "+this.state.public_id +"\n signature: "+ signature);
                  console.log("201 Upload Success to Cloud: access ");
                  console.log("Avatar address: "+this.state.avatar);
                  console.log("Upload to cloud Success");

                  //fetch : register
                  let  registerURL = "http://localhost:4000/users/registrate";
                  fetch(registerURL,{
                    method:'POST',
                    headers:{
                      'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        name: this.state.author_name,
                        bio: this.state.bio,
                        avatar: this.state.avatar

                    })
                  }).then(res =>{
                    console.log("res: "+res)}).catch(err => {
                    window.alert("Upload failed")
                    console.log("400 -----Cant register-----")
                    console.log(`400 register : Error when fetching: ${err}`);});


                }
                else{
                  console.log("400 Error : could not perform uploading to cloudinary");
                  return "err";
                }
              });



          // if (this.state.isInfoLoaded){
            console.log("widget open ");
            cloudStorage.open();
          // }else{
                    // window.alert("Please fill in the name and caption !");
                  // }

  }
  //upload the entire image process by calling backend uploadArtwork -> blockchain
async  Register(){
      console.log("Upload Section :");
      //
      try{
          await this.IsInfoLoad();
          if (this.state.isInfoLoaded){
              this.Upload();
          }else{
            window.alert("Please fill in the name and caption !");
          }

      }
      catch(err){

        console.log("400 Error: could not perform uploading :"+err);
      };
//         console.log("Upload function - success!: "+this.state.public_id+"accessL"+
// this.state.accessL);
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
          <button onClick={this.Register}>Submit</button>
      </div>

  );
  }
}
export default SignInForm;

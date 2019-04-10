 import React, { Component } from "react";
import cloudinary from "cloudinary-react";
import UploadButton from "../components/UploadButton";
import '../css/button.css';

class Upload extends Component {
  constructor(){
    super();
    this.Upload = this.Upload.bind(this);
    this.state = { validated: false, uploaded:false, public_id:'',accessL:'', img_preview_loc:'', img_name:'',  img_caption:''};
  }
  public_id = '';
 uploadToCloud(){
      let cloudName="fyp18003";
      let uploadPreset= "tt3uhkl0";
      // notification for entire upload process
      let isUploaded = false;
      let  accessL,public_id,signature;
      //determine the storage folder
      let folder = "sample";
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

        if (result.event === "success") {
          window.alert(result.info.secure_url);
          this.state.accessL = result.info.secure_url;
          this.state.public_id = result.info.public_id;
          signature = result.info.signature;
          console.log("201 Upload Success to Cloud: access :"+ this.state.accessL +"\n public_id: "+this.state.public_id +"\n signature: "+ signature);

          // fetching artwork data to backend
          console.log("Fetching :POST --> uploadArtwork route");
          let  uploadArtwork = "http://localhost:4000/artworks/uploadArtwork";
          fetch(uploadArtwork,{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
                author_id: "5ca5ec14a5ef65243d180a71",
                name: "Dou Dou",
                caption: "cute cat",
                access: this.state.accessL
            })
          }).then(res =>{console.log("res: "+res)}).catch(err => {
            console.log(`400 Upload Artwork to Ethereum : Error when fetching: ${error}`);});


      }

      else{
        console.log("400 Error : could not perform uploading to cloudinary");
        return "err";
      }
      });
              console.log("widget open ");
        cloudStorage.open();
        console.log("widget close ");
        return;

      // --------------cloud image upload ends --------
        // cloudStorage.v2.uploader.upload("", function(error, result) {console.log(result, error); });


    }
    //upload the entire image process by calling backend uploadArtwork -> blockchain
    Upload(){
        console.log("Upload Section :");
        //
        try{
          this.uploadToCloud(() => console.log('uploadtoCloud done'));

        // this.uploadToCloud().then(cloudInfo =>{
          // console.log("201 : Finish uploading ");
          // console.log("Cloud Image Info :"+cloudInfo);

          // let cloudInfo = this.uploadToCloud;
  }


        // });
        catch(err){
          console.log("400 Error: could not perform uploading :"+err);
        };
//         console.log("Upload function - success!: "+this.state.public_id+"accessL"+
// this.state.accessL);

    }


    // delete function:
    // authentication

    // cloudinary.v2.uploader.destroy(public_id, options, callback);

    // <Form>1.Artwork name 2.caption 3.source work

    handleInput(){
      console.log("image is onload");
    }


    render() {


      return(

        <div className="UploadArtwork" >
            <h1 style={{ padding: '0 0 15px 0'}}>Upload Artwork</h1>
            <form onSubmit={this.handleSubmit}>
              <label>
              Artwork Name:
                <input type="text" ref={(name) => this.state.img_name = name} />
              </label>
              <br/>
              <label>
               Caption:
                <input type="text" ref={(caption) => this.state.img_caption = caption} />
              </label>
              <br/>
              <input type='file' id="imgInput" accept=".jpg,.jpeg,.png"  onInput={ this.handleInput.bind()}/>
              <img id="image_preview" src="#" alt="image preview" />
            </form>
              <UploadButton type="submit" value="Submit" Upload={this.Upload.bind(this.uploadToCloud)}/>
              <div>
              <input id="back" type="button" value="back" style={{display:'inline', margin:'10px'}}/>
              </div>
        </div>
      );
    }
}
export default Upload;

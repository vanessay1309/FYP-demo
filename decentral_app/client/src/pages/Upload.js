import React, { Component } from "react";
import UploadButton from "../components/UploadButton"


class Upload extends Component {


  uploadToCloud(){

  }
  upload(){

  }
  
  render() {
    return(

      <div id="options">
          <h1>Upload Artwork</h1>
        <input id="back" type="button" value="back" style={{display:'inline', margin:'10px'}}/>
        <button className="w3-content" >Upload</button>
        <button className="w3-content" >Delete</button>
      </div>
    );
  }
}
export default Upload;

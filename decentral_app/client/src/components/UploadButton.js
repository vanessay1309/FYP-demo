import React, { Component } from "react";
import "../css/button.css";


class UploadButton extends Component {


  render() {
    return(
      <button className="spin circle"onClick={this.props.Upload}>Upload</button>


    );
  }
}
export default UploadButton;

// //cloudinary widget call
// let widget = cloudinary.createUploadWidget({
//   cloudName: 'fyp18003',
//   uploadPreset: 'tt3uhkl0',
//   sources: ['local', 'url'],
// }, (error, result) => {
//
//   if (result.event === "success") {
//
//     window.alert(result.info.secure_url);
//     accessL = result.info.secure_url;
//     public_id = result.public_id;
//    signature = result.signature;
//    delete function:
//    authentication
//
//    cloudinary.v2.uploader.destroy(public_id, options, callback);
//
// }
// });
//   widget.open();

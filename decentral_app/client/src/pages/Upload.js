import React, { Component } from "react";
import cloudinary from "cloudinary-react";
import UploadButton from "../components/UploadButton";
import '../css/button.css';
import List from '../components/sourceList'
// var cloud =require('cloudinary');
class Upload extends Component {
  constructor(props){
    super(props);
    this.Upload = this.Upload.bind(this);
    this.state = {
      isInfoLoaded:false,
      public_id:'',
      accessL:'',
      img_loc:'',
      img_data:'',
      img_name:'',
      img_caption:'',
      artworkList: [] ,
      isLoaded: false,
      isFetched: false,
      sourcePreviewURL:"",
      source_artwork_id:"",
      source_author_id:"",
      isSourceWorkLoaded:false
    };

    this.handleImageAddressInput = this.handleImageAddressInput.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.selectHandler = this.selectHandler.bind(this);

  }

  async componentDidMount(){
    // this.getInitialState();
    await  this.getAllArtworkFromServer();
  //  console.log("State after fetching:\nartworkList Length" +this.state.artworkList.length);
  //retrieve artwork from Artworkroute
  }

  //whenever a component is updated
  async componentDidUpdate(){
     this.isArtworkloaded();
  }
  //  componentShouldUpadte(props,nextState){
  //   if(nextState.sourcePreviewURL!=""){
  //
  //     return true;
  //   }
  //   else return false;
  // }

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
    //read the data file url

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
  }

//upload function to cloud
async  uploadToCloud(){
      let cloudName="fyp18003";
      let uploadPreset= "tt3uhkl0";
      // notification for entire upload process
      let isUploaded = false;
      let  accessL,public_id,signature;

      //determine the storage folder
      let folder = "sample";
      let artwork_id="";

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

          this.state.accessL = result.info.secure_url;
          this.state.public_id = result.info.public_id;
          signature = result.info.signature;
          // console.log("201 Upload Success to Cloud: access :"+ this.state.accessL +"\n public_id: "+this.state.public_id +"\n signature: "+ signature);
          console.log("201 Upload Success to Cloud: access ");
          window.alert("Upload Success");

          // fetching artwork data to backend
          // --> return artwork_id
          console.log("Fetching :POST --> uploadArtwork route");
          let  uploadArtwork = "http://localhost:4000/artworks/uploadArtwork";
          fetch(uploadArtwork,{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
                author_id: "5ca5ec14a5ef65243d180a71",
                name: this.state.img_name,
                caption: this.state.img_caption,
                access: this.state.accessL
            })
          }).then(res =>{
            console.log("res: "+res);
            artwork_id = res.artwork_id;

        }).catch(err => {
            console.log(`400 Upload Artwork to Ethereum : Error when fetching: ${error}`);});

           // fetch source artwork
           // TODO : wait for artwork_id return
           if(this.state.isSourceWorkLoaded){
             console.log("Fetching :POST --> addSourceArtwork route");
             let  addSourceArtworkURL = "http://localhost:4000/artworks/addSource";
             fetch(addSourceArtworkURL,{
               method:'POST',
               headers:{
                 'Content-Type':'application/json'
               },
               body: JSON.stringify({
                   author_id: "5ca5ec14a5ef65243d180a71", //change to this.props.user_id :TODO
                   image_id: artwork_id,
                   source_aid: this.state.source_artwork_id,
                   source_iid: this.state.source_author_id
               })
             }).then(res =>{
               console.log("res: "+res)}).catch(err => {
               console.log("400 -----Cant add Source -----")
               console.log(`400 add source to Ethereum : Error when fetching: ${error}`);});
           }
      }

      else{
        console.log("400 Error : could not perform uploading to cloudinary");
        return "err";
      }
      });
        console.log("widget open ");
        cloudStorage.open();

      // --------------cloud image upload ends --------
        // cloudStorage.v2.uploader.upload("", function(error, result) {console.log(result, error); });


    }
    //upload the entire image process by calling backend uploadArtwork -> blockchain
async  Upload(){
        console.log("Upload Section :");
        //
        try{
          await  this.IsInfoLoad();
            if (this.state.isInfoLoaded){
                this.uploadToCloud();
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

    //get option from the available artwork
    getAllArtworkFromServer(){
        let  urlArtworkList = "http://localhost:4000/artworks";
         console.log("Fetching /artwork route");
           fetch(urlArtworkList).then(
               results => results.json()).then(results => this.setState({'artworkList': results.Artworks})).catch(error => {
               console.log(`400 Retrieving Artwork List Error when fetching: ${error}`);
               this.setState({isFetched:false});
               return;
         });
         console.log("Fetching /artwork route");
         this.setState({isFetched:true});

    }

    // Check the rendering : Is artwork loaded
    isArtworkloaded(){
        // console.log(  "isArtworkloaded function " + this.state.artworkList.length);
        // checking the loading state
        if (this.state.artworkList.length > 0 && this.state.isLoaded==false){
        console.log(  "artworkslist is loaded " +this.state.artworkList.length);
            this.setState({isLoaded : true});
          }
        if(this.state.artworkList.length == 0)
          console.log(  "Artworklist is null "+this.state.artworkList.length);
    }

    // Check input box content
    IsInfoLoad(){
      if(this.state.img_name != "" && this.state.img_caption != ""){
          this.setState({isInfoLoaded:true});
      }
      else{
        this.setState({isInfoLoaded:false});
      }
    }


    //handle option selected --> source artwork data loaded
  selectHandler(e){
    var index = e.target.selectedIndex;
    var optionElement = e.target.childNodes[index];
    var sartwork_url =  optionElement.getAttribute('url');
    var sartwork_id =  optionElement.getAttribute('id');
    var sauthor_id  =  optionElement.getAttribute('author_id');
      // let artwork_url = event.target.find('option:selected',this).attr('url');
      console.log(sartwork_url);
      this.setState({
        sourcePreviewURL: sartwork_url,
        source_artwork_id:sartwork_id,
        source_author_id:sauthor_id,
        isSourceWorkLoaded:true
      });


    }

    render() {
      //preview the loaded image
      let $imagePreview = null;
      if(this.state.img_loc){
        $imagePreview =(<img id="image_preview" src={this.state.img_data} alt="image preview" />);
      }else{
        $imagePreview=  (<img id="image_preview" value=" Your image preview Here" />);
      }

      let $sourceImagePreview = null;
      if(this.state.sourcePreviewURL){
        $sourceImagePreview =(<img id="Sourceimage_preview" src={this.state.sourcePreviewURL} alt="image preview" />);
      }else{
        $sourceImagePreview=  (<img id="Sourceimage_preview" alt=" Your image preview Here" />);
      }
      return(
        <div className="UploadArtwork" >
            <h1 style={{ padding: '0 0 15px 0'}}>Upload Artwork</h1>


              <div className="artwork_info">
                <label for="name">
                Artwork Name:
                </label>
                <input id = "name" type="text" placeholder="type name of the artwork here.." value={this.state.img_name} onChange={this.handleNameChange} required/>

                <br/>
                <label for="caption">
                Caption:
                </label>
                <textarea id = "caption" type="text" cols="20" rows="5" placeholder="type caption here.." value={this.state.img_caption} onChange={this.handleCaptionChange} required/>
              </div>

              <br/>
              <input type='file' id="imgInput" accept=".jpg,.jpeg,.png"  onChange={ this.handleImageAddressInput} />
              <br/>
              {$imagePreview}
              <br/>
              <div id="Source">
                <label for="Source_List"> Source List:</label>
                <select id="Source_List" onChange={this.selectHandler}>
                    <option value=""/>
                {    this.state.isLoaded &&
                  this.state.artworkList.map(function(artwork){

                   return(
                     <option value={artwork.name} id={artwork.image_id} author_id={artwork.author_id} url={artwork.access} >{artwork.name} </option>
                   )
                 })
                 }
                  </select><br/>
                  Source preview :<br/>{$sourceImagePreview}
              </div>
              <UploadButton  Upload={this.Upload.bind()}/>



        </div>
      );
    }
}
export default Upload;
// body:
// "author_id": "5c765815c8dd530a9f247b4b",
//          "image_id": "5ca5ef821845d7248e9615fc",
// "source_aid":"5ca5f55272595c24ddf8a35c"
// "source_iid":"5ca5f55272595c24ddf8a35c"

//--> put it on the backend --> non-widget upload
// let  api_sign_request = function(params_to_sign,api_secret);
//cloudinary upload
// cloudinary.config({
//   cloud_name:"fyp18003",
//   api_key:674772198887786,
//   api_secret:'vd6twqB4LH18bVUiIdzNe03XcoE'
// });
//   cloudinary.uploader.unsigned_upload( "{img_data}",uploadPreset,{cloud_name:"fyp18003"}
//   , (error, result) => {
//     console.log("file uploaded");
//     console.log("result : ");
//   });
// }

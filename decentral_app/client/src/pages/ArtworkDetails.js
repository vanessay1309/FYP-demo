import React, { Component } from "react";

class ArtworkDetails extends Component {

  constructor(props){
    super(props);
      this.state= {
          artworkDetails:[],
          author:"",
          isLoaded: false,
          isFetched: true
        };

  }
  async componentDidMount(){

  //retrieve artwork from Artworkroute
  this.getArtworkDetailFromServer();

  };


  // retrieve artwork from Artworkroute
getArtworkDetailFromServer(){
   let artwork_id= localStorage.getItem("artworkID");
   let author_id  = localStorage.getItem("authorID");
   let author = localStorage.getItem("author");
   this.setState({author:author});
   console.log(artwork_id +" "+ author_id);
   let  urlArtworksList = "http://localhost:4000/artworks/details/"+author_id+"/"+artwork_id;

      fetch(urlArtworksList).then(
          results => results.json()).then(results => this.setState({'artworkDetails': results})).catch(error => {
    console.log(`400 Retrieving Artwork List Error when fetching: ${error}`);
    this.state.isFetched=false;
    });
}


  // }
// Check the rendering : Is artwork loaded
isArtworkloaded(){
  // console.log(  "isArtworkloaded function " + this.state.artworkList.length);
  // checking the loading state
  if ((this.state.artworkDetails !='')&& this.state.isLoaded==false){
  console.log(  "artwork is loaded ");
      this.setState({isLoaded : true});
    }
  if(this.state.artworkDetails == '')
    console.log(  "400 Error: artwork is empty ");
}
//get 500 error code for server failure : TODO


  render() {
    this.isArtworkloaded();
    return(
      <div>
        <h1>Artwork Detail</h1>


        <div id="loader">
          { !this.state.isFetched && <div> <br/><h1><span>🔥 🔥 </span>... Something has gone wrong ...<span>🔥 🔥 </span> ..</h1></div>}
         { this.state.isFetched&&!this.state.isLoaded && <div> <br/><h1>Artwork is Loading ...<span>🐑 ..🐑 .. 🐑 ..🐑 </span>..</h1>
           </div>
         }

          <div className="container">
            <div className = "image">
              <img alt="image"src={this.state.artworkDetails.access}/>
            </div>
            <div className = "details">
              Artwork name : {this.state.artworkDetails.name}
              <br/>
              Caption :{this.state.artworkDetails.caption}
              <br/>
              Author :{this.state.author}
              <br/>
              sources :
              <br/>
              derivatives :
            </div>
            <div className="image-tree">
            </div>
          </div>
        </div>

     </div>

    );
  }
}
export default ArtworkDetails;

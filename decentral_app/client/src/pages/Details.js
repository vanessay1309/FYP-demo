import React, { Component } from "react";

class Details extends Component {

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
  // isArtworkloaded(){
  //   // checking the loading state
  //   if (this.state.artworksList.length >0 ){
  //   console.log(  "artworkslist is loaded " +this.state.artworksList.length);
  //       this.state.isLoaded = true;
  //     }
  //     else
  //       {
  //         console.log(  "artworkslist is null "+this.state.artworksList.length);
  //         this.state.isLoaded = false;
  //       }
  // }
//get 500 error code for server failure : TODO


  render() {
    // this.isArtworkloaded();
    return(
      <div>
        <h1>Artwork Detail</h1>


               <div id="loader">

                 { !this.state.isFetched && <div> <br/><h1>🔥 🔥 ... Something has gone wrong ...🔥 🔥  ..</h1></div>}
                { this.state.isFetched&&!this.state.isLoaded && <div> <br/><h1>Artwork is Loading ...🐑 ..🐑 .. 🐑 ..🐑 ..</h1></div>}
               </div>


                  })
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

    );
  }
}
export default Details;

import React, { Component } from "react";

class Details extends Component {

  constructor(props){
    super(props);
      this.state= {
          artworksList: [] ,
          isLoaded: false,
          isFetched: true
        };
  }
  async componentDidMount(){

  //retrieve artwork from Artworkroute
  this.getArtworkFromServer();

  };


  //retrieve artwork from Artworkroute
getArtworkFromServer(){
   let  urlArtworksList = "http://localhost:4000/artworks";

      fetch(urlArtworksList).then(
          results => results.json()).then(results => this.setState({'artworksList': results.Artworks})).catch(error => {
    console.log(`400 Retrieving Artwork List Error when fetching: ${error}`);
    this.state.isFetched=false;
    });



  }
// Check the rendering : Is artwork loaded
  isArtworkloaded(){
    // checking the loading state
    if (this.state.artworksList.length >0 ){
    console.log(  "artworkslist is loaded " +this.state.artworksList.length);
        this.state.isLoaded = true;
      }
      else
        {
          console.log(  "artworkslist is null "+this.state.artworksList.length);
          this.state.isLoaded = false;
        }
  }
//get 500 error code for server failure : TODO


  render() {
    this.isArtworkloaded();
    return(
      <div>
        <h1>Artwork List</h1>


               <div id="loader">

                 { !this.state.isFetched && <div> <br/><h1>🔥 🔥 ... Something has gone wrong ...🔥 🔥  ..</h1></div>}
                { this.state.isFetched&&!this.state.isLoaded && <div> <br/><h1>Artwork is Loading ...🐑 ..🐑 .. 🐑 ..🐑 ..</h1></div>}
               </div>

               <div id="list">
                 <div className="grid">
                 {    this.state.isLoaded &&
                   this.state.artworksList.map(function(artwork){
                    return(
                      <img src={artwork.access} alt={artwork.name}/>
                    )
                  })
                  }




                 </div>
               </div>
               <div id="detail" style={{display:'none'}}>
               </div>




           </div>
    );
  }
}
export default Details;

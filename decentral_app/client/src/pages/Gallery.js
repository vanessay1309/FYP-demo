import React, { Component } from "react";

class Gallery extends Component {

  constructor(props){
    super(props);
      this.state= {
          artworksList: [] ,
        };
  }
  async componentDidMount(){

  //retrieve artwork from Artworkroute
    this.getArtworkFromServer();
  }


  //retrieve artwork from Artworkroute
  getArtworkFromServer(){
   let  urlArtworksList = "http://localhost:4000/artworks";

      fetch(urlArtworksList).then(
          results => results.json()).then(results => this.setState({'artworksList': results.Artworks})).catch(error => {
    console.log(`400 Error when fetching: ${error}`);
    });
  }
  render() {
    return(
      <div>
        <h1>Artwork List</h1>


               <div id="loader">
               </div>
               <div id="list">
                 <div className="grid">
                 {this.state.artworksList.map(function(artwork){
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
export default Gallery;

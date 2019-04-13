import React, { Component } from "react";
import{Route, withRouter, NavLink} from 'react-router-dom';
import Details from "./Details"
class Gallery extends Component {

  constructor(props){
    super(props);
      this.state= {
          artworkList: [] ,
          isLoaded: false,
          isFetched: true
        };
        // this.goToImageDetail = this.goToImageDetail.bind(this);
  }
  async componentDidMount(){
    this.getInitialState();
    this.getAllArtworkFromServer();
  //retrieve artwork from Artworkroute



  };
  getInitialState(){
    console.log("artworkList Length" +this.state.artworkList.length+
    "isLoaded"+this.state.isLoaded+" isFetched: "+this.state.isFetched);
  }

  //retrieve artwork from Artworkroute
getAllArtworkFromServer(){
   let  urlArtworkList = "http://localhost:4000/artworks";

      fetch(urlArtworkList).then(
          results => results.json()).then(results => this.setState({'artworkList': results.Artworks})).catch(error => {
    console.log(`400 Retrieving Artwork List Error when fetching: ${error}`);
    this.state.isFetched=false;
    });



  }
//get specific artwork details
// get the id of the author, and image_id
//   getArtworkFromServer(){
//     let author_id = '';
//     let image_id = '';
//      let  urlArtwork = "http://localhost:4000/artworks/details/:author/:image";
//
//         fetch(urlArtwork).then(
//             results => results.json()).then(results => this.setState({'Artwork': results.Artworks})).catch(error => {
//       console.log(`400 Retrieving Artwork List Error when fetching: ${error}`);
//       this.state.isFetched=false;
//       });
// }

// Check the rendering : Is artwork loaded
  isArtworkloaded(){
    // checking the loading state
    if (this.state.artworkList.length > 0 ){
    console.log(  "artworkslist is loaded " +this.state.artworkList.length);
        this.state.isLoaded = true;
      }
      else
        {
          console.log(  "artworkslist is null "+this.state.artworkList.length);
          this.state.isLoaded = false;
        }
  }
//get 400 error code for fetching failure : TODO
//get image detail --> render the page of detail
async  goToImageDetail(event){
     let img_id = event.target.id;
     let img_name = event.target.alt;
     let img_author_id = event.target.getAttribute('author_id');
     let img_author = event.target.getAttribute('author_name');
     localStorage.setItem("artworkID", img_id);
     localStorage.setItem("authorID", img_author_id);
     localStorage.setItem("author", img_author);
     // this.props.history.push('/details/${img_id}');

   console.log("Go to Image Detail section image_id: "+ +" name: "+img_name+" author_id: "+img_author_id);

  }



  render() {

  this.isArtworkloaded();
    var that = this;
    return(
      <div>

      <hr/>
        <h1>Artwork List</h1>
        <hr/>
               <div id="loader">
                 { !this.state.isFetched && <div> <br/><h1>🔥 🔥 ... Something has gone wrong ...🔥 🔥  ..</h1></div>}
                { this.state.isFetched&&!this.state.isLoaded && <div> <br/><h1>Artwork is Loading ...🐑 ..🐑 .. 🐑 ..🐑 ..</h1>
                  </div>
                }
               </div>

               <div id="list">
                 <div className="grid">
                 {    this.state.isLoaded &&
                   this.state.artworkList.map(function(artwork){
                     let url = "/gallery/"+artwork.name+"/details";
                    return(
                    <NavLink to="/artworks/details">  <img id={artwork.image_id} author_id={artwork.author_id} author_name={artwork.author} src={artwork.access} alt={artwork.name} onClick={that.goToImageDetail}/></NavLink>
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
export default withRouter(Gallery);

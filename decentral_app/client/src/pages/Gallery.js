import React, { Component } from "react";
import{Route, withRouter, NavLink} from 'react-router-dom';
import ArtworkDetails from "./ArtworkDetails"
class Gallery extends Component {

  constructor(props){
    super(props);
      this.state= {
          artworkList: [] ,
          isLoaded: false,
          isFetched: false
        };
  }

  async componentDidMount(){
    this.getInitialState();
    await  this.getAllArtworkFromServer();
  //  console.log("State after fetching:\nartworkList Length" +this.state.artworkList.length);
  //retrieve artwork from Artworkroute
  }

  //whenever a component is updated
  async componentDidUpdate(){
     this.isArtworkloaded();
  }

  getInitialState(){
    console.log("Initial State\nartworkList Length" +this.state.artworkList.length+
    "\nisLoaded: "+this.state.isLoaded+"\nisFetched: "+this.state.isFetched);
  }

  //retrieve artwork from Artworkroute
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
//get 400 error code for fetching failure : TODO
//get image detail --> render the page of detail
  goToImageDetail(event){
     let img_id = event.target.id;
     let img_name = event.target.alt;
     let img_author_id = event.target.getAttribute('author_id');
     let img_author = event.target.getAttribute('author_name');
     window.sessionStorage.setItem("artworkID", img_id);
     window.sessionStorage.setItem("authorID", img_author_id);
     window.sessionStorage.setItem("author", img_author);
     // this.props.history.push('/details/${img_id}');

   console.log("Go to Image Detail section image_id: "+img_id +" name: "+img_name+" author_id: "+img_author_id);

  }



  render() {

    var that = this;
    return(
      <div>

      <hr/>
        <h1>Artwork List</h1>
        <hr/>
               <div id="loader">
                 { !this.state.isFetched && <div> <br/><h1><span>🔥 🔥 </span>... Something has gone wrong ...<span>🔥 🔥 </span> ..</h1></div>}
                { this.state.isFetched&&!this.state.isLoaded && <div> <br/><h1>Artwork is Loading ...<span>🐑 ..🐑 .. 🐑 ..🐑 </span>..</h1>
                  </div>
                }
               </div>

               <div id="list">
                 <div className="grid">
                 {    this.state.isLoaded &&
                   this.state.artworkList.map(function(artwork){
                     let url = "/artworks/"+artwork.name+"/details";
                    return(
                    <NavLink to={url}>
                      <img id={artwork.image_id} author_id={artwork.author_id} author_name={artwork.author} src={artwork.access} alt={artwork.name} onClick={that.goToImageDetail}/>
                    </NavLink>
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

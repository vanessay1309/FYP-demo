import React, { Component } from "react";
import{Route, withRouter, NavLink, Switch} from 'react-router-dom';
const initialState = {
    artworkDetails:[],
    sources:[],
    derivatives:[],
    artwork_id:null,
    author_id:null,
    author:null,
    isLoaded: false,
    isFetched: false
  };
class ArtworkDetails extends Component {

  constructor(props){
    super(props);
      this.state= initialState;
        this.goToImageDetail = this.goToImageDetail.bind(this);
  }
async componentWillMount(){
   this.getInitialState();
  console.log("componentWillMount");

}
async componentDidMount(){
   this.getArtworkDetailFromServer();
  console.log("componentDidMount");
  //retrieve artwork from Artworkroute



  };
async componentDidUpdate(){
   this.isArtworkloaded();
      console.log("componentDidUpdate");

}

async shouldComponentUpdate(nextProps, nextState) {
  console.log("componentShouldUpdate");

  if ((this.state.artwork_id != nextState.artwork_id)){
      console.log("This State artwork id: "+this.state.artwork_id +"\nnext State artwork id: "+nextState.artwork_id);
      console.log("Should update");
      // await this.reset();
       await this.getInitialState();
       this.getArtworkDetailFromServer();

      this.render();
      return true;
    }
        console.log("not update");
    return false;

  }

async getInitialState(){
  let artwork_id= window.sessionStorage.getItem("artworkID");
  let author_id  = window.sessionStorage.getItem("authorID");
  let author= window.sessionStorage.getItem("author");

  this.setState({
    artwork_id:artwork_id,
    author_id:author_id,
    author:author
  });
  console.log("Get initial State from local storage : \n "+this.state.artwork_id +"\nauthor_id: "+this.state.author_id + "\nauthor name"+ this.state.author);

}
// retrieve artwork from Artworkroute
getArtworkDetailFromServer(){
    console.log("Go to server");
   let artwork_id= this.state.artwork_id;
   let author_id  = this.state.author_id;
   console.log(artwork_id +" "+ author_id);
   let  urlArtworksList = "http://localhost:4000/artworks/details/"+author_id+"/"+artwork_id;
   console.log(urlArtworksList);
   //fetching to /artworks/details/:author_id/artwork_id;
  fetch(urlArtworksList).then(
    results => results.json()).then(results =>this.setState({'artworkDetails': results, 'sources':results.sources, 'derivatives':results.derivatives})).catch(error  => {
          console.log(`400 Retrieving Artwork List Error when fetching: ${error}`);
          this.setState({isFetched:false});
          });
  this.setState({isFetched:true});
  console.log("fetched");

}



 reset(){
   this.setState(initialState);
 }



//get image detail --> render the page of detail
  goToImageDetail(event){
     let img_id = event.target.id;
     // let img_name = event.target.alt;
     let img_author_id = event.target.getAttribute('author_id');
     let img_author = event.target.getAttribute('author_name');
     console.log("Go to Image Detail section image_id: "+img_id +" author name: "+img_author+" author_id: "+img_author_id);

       this.reset();
     window.sessionStorage.setItem("artworkID", img_id);
     window.sessionStorage.setItem("authorID", img_author_id);
     window.sessionStorage.setItem("author", img_author);

     let temp_artwork_id = window.sessionStorage.getItem("artworkID");
     let temp_author_id  = window.sessionStorage.getItem("authorID");
     let temp_author= window.sessionStorage.getItem("author");
     console.log("get Item TESTING");
     console.log(temp_artwork_id+"\n"+temp_author_id+"\n"+temp_author);
     // this.props.history.push('/details/${img_id}');
     // this.getArtworkDetailFromServer();

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
  if(this.state.artworkDetails == ''&& this.state.isFetched==false)
    console.log(  "400 Error: artwork is not loaded ");

}


  render() {
    let sourceImg;
    var that = this;
    sourceImg=(  this.state.sources.map(function(artwork){
      let url = "/artworks/"+artwork.name+"/details";
        return(
          <NavLink to={url}><img src={artwork.access} id={artwork.image_id} alt={artwork.name} author_name={artwork.author} title={artwork.name} author_id={artwork.author_id} onClick={that.goToImageDetail}/></NavLink>

        )
      })
    );


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

            </div>
              <hr/>
            <div className="image-tree">
              <label for="sourceList">Source</label>
              <div id="sourceList">
                {sourceImg}
                </div>
                <label for="derivativeList">derivatives</label>
                <div id="derivativeList">

                { this.state.derivatives.map(function(artwork){
                    let url = "/artworks/"+artwork.name+"/details";
                    return(
                      <NavLink to={url}><img src={artwork.access} id={artwork.image_id} alt={artwork.name} title={artwork.name} author_name={artwork.author} author_id={artwork.author_id} onClick={that.goToImageDetail}/></NavLink>

                    )
                  })
                }
                </div>
            </div>


          </div>
        </div>

     </div>

    );
  }
}
export default withRouter(ArtworkDetails);

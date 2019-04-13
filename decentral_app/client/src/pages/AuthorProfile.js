import React, { Component } from "react";
import{Route, withRouter, NavLink} from 'react-router-dom';
// --> get author info first
// /get/:id	 		: GET specific user by :id
// Respond body (HTML Status: 200)
// {
// 	"_id": "5ca5ec14a5ef65243d180a71",
// 	"name": "Tessa",
// 	"account": "wallet address",
// 	"bio": "hi i am Tessa",
// 	"avatar": "access",
// 	"__v": 0
// }
// ==>  get author's artwork
// /byAuthor/:author
class AuthorProfile extends Component {

  constructor(props){
    super(props);
      this.state= {
          authorDetails:[],
          artworkList: [] ,
          isArtworkLoaded: false,
          isAuthorLoaded: false,
          isArtworkFetched: false,
          isAuthorFetched:false
        };

  }
  async componentDidMount(){
  //retrieve authorDetails from userRoute
  this.getAuthorFromServer();
  //retrieve artwork from Artworkroute
  this.getAllArtworkFromServer();

  };
//------------------------- Author Details loading ----------------------
// retrieve artwork from Artworkroute
getAuthorFromServer(){
    let author_id  = localStorage.getItem("authorID");
     let  urlAuthorDetails= "http://localhost:4000/users/get/"+author_id;
      console.log("Fetching /users/get/:id route URL: " + urlAuthorDetails);
        fetch(urlAuthorDetails).then(
            results => results.json()).then(results => this.setState({'authorDetails': results})).catch(error => {
            console.log(`400 Retrieving Author Details Error when fetching: ${error}`);
            this.setState({isAuthorFetched:false});
            return;
      });
      console.log("200 Fetching Success: /users/get/:id");
      this.setState({isAuthorFetched:true});

}

//check is author detail loaded
  isAuthorloaded(){
    // console.log(  "isArtworkloaded function " + this.state.artworkList.length);
    // checking the loading state
    if ((this.state.authorDetails !='') && this.state.isAuthorLoaded==false){
        this.setState({isAuthorLoaded : true});
        console.log(  "author Details is loaded ");

      }
    if(this.state.authorDetails == '')
      console.log(  "author Details is null ");
  }




//------------------------- Artwork List loading ------------------------
  // retrieve artwork from Artworkroute
  getAllArtworkFromServer(){
    let author_id  = localStorage.getItem("authorID");
    let urlArtworkList = "http://localhost:4000/artworks/byAuthor/"+author_id;   //TODO
        console.log("Fetching /artwork/byAuthor/:id route ");
          fetch(urlArtworkList).then(
              results => results.json()).then(results => this.setState({'artworkList': results.Artworks})).catch(error => {
              console.log(`400 Retrieving Artwork List Error when fetching: ${error}`);
              this.setState({isArtworkFetched:false});
              return;
        });
        console.log("Fetching /artwork route");
        this.setState({isArtworkFetched:true});

  }

// for browsing the artwork of an author
  goToImageDetail(event){
     let img_id = event.target.id;
     let img_name = event.target.alt;
     let img_author_id = event.target.getAttribute('author_id');
     let img_author = event.target.getAttribute('author');
     console.log("Go to Image Detail section: \nimage_id: "+ img_id+"\nname: "+img_name+"\nauthor_id: "+img_author_id +"\nauthor name:" + img_author) ;

     localStorage.setItem("artworkID", img_id);
     localStorage.setItem("authorID", img_author_id);
     localStorage.setItem("author", img_author);
     // this.props.history.push('/details/${img_id}');


  }

  // Check the rendering : Is artwork loaded
    isArtworkloaded(){
      // console.log(  "isArtworkloaded function " + this.state.artworkList.length);
      // checking the loading state
      if (this.state.artworkList.length > 0 && this.state.isArtworkLoaded==false){
      console.log(  "artworkslist is loaded " +this.state.artworkList.length);
          this.setState({isArtworkLoaded : true});
        }
      if(this.state.artworkList.length == 0)
        console.log(  "artworkslist is null "+this.state.artworkList.length);
  }
//get 500 error code for server failure : TODO


  render() {
    this.isAuthorloaded();
    this.isArtworkloaded();
    var that = this;
    let $AuthorDetails = null;
    let author = this.state.authorDetails.name;
    console.log("author is : "+  author);
    console.log("rendering : "+this.state.isAuthorLoaded +" "+this.state.isAuthorFetched);
    if(this.state.isAuthorLoaded && this.state.isAuthorFetched){
      $AuthorDetails = (<div>
                          <img src={this.state.authorDetails.avatar}/> <br/>
                          Author name : {this.state.authorDetails.name} <br/>
                          Biography :{this.state.authorDetails.bio}
                        </div>);
    }

    return(
    <div className = "Profile">
      <br/>
      <hr/>
      <h1>Profile</h1>
      <hr/>




      <div className="Author">
        <div id="loader">
          { (!this.state.isAuthorFetched) && <div>
              <br/><h1><span>🔥 🔥 </span>... Something has gone wrong (authorDetails)...<span>🔥 🔥 </span> ..</h1>
            </div>}
            { this.state.isAuthorFetched && !this.state.isAuthorLoaded && <div> <br/><h1>Author is Loading ...<span>🐑 ..🐑 .. 🐑 ..🐑 ..</span></h1></div>}
        </div>

            <div className = "AuthorDetails">
              {$AuthorDetails}
            </div>
      </div>


      <div className="artwork_list">
      <br/>
      <hr/>
        <h1>Artwork List</h1>
        <hr/>
        <div id="loader">
          { (!this.state.isArtworkFetched)&&
          <div>
          <br/><h1><span>🔥 🔥 </span>... Something has gone wrong (image) ...<span>🔥 🔥 </span> ..</h1>
          </div>}

          { this.state.isArtworkLoaded&&!this.state.isArtworkFetched &&
          <div>
            <br/>
            <h1>Artwork is Loading ...<span>🐑 ..🐑 .. 🐑 ..🐑 </span>..</h1>
          </div>
          }
        </div>
        <div id="list">
          <div className="grid">
          {    this.state.isArtworkLoaded &&
            this.state.artworkList.map(function(artwork){
              let url = "/artworks/details";
             return(
             <NavLink to={url}>  <img id={artwork.image_id} author_id={artwork.author_id} src={artwork.access} alt={artwork.name} author={author} onClick={that.goToImageDetail}/> </NavLink>


             )
           })
           }

          </div>
        </div>
      </div>


    </div>

    );
  }
}
export default withRouter(AuthorProfile);

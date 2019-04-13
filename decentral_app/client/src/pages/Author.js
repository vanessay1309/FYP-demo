import React, { Component } from "react";

class Author extends Component {

  constructor(props){
    super(props);
      this.state= {
          authorList: [] ,
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
   let  urlauthorList = "http://localhost:4000/users";

      fetch(urlauthorList).then(
          results => results.json()).then(results => this.setState({'authorList': results})).catch(error => {
    console.log(`400 Retrieving Author List Error when fetching: ${error}`);
    this.setState({isFetched : false});
    });



  }
// Check the rendering : Is artwork loaded
  isAuthorloaded(){
    // checking the loading state
        if (this.state.authorList.length > 0 && this.state.isLoaded==false){
        console.log(  "authorList is loaded " +this.state.authorList.length);
            this.setState({isLoaded : true});
            return;
          }
        if(this.state.authorList.length == 0)
          console.log(  "authorlist is null "+this.state.authorList.length);
  }
//get 500 error code for server failure : TODO


  render() {
    this.isAuthorloaded();
    return(
      <div>
        <hr/>
        <h1>Artwork List</h1>
        <hr/>

                <div id="loader">
                  { !this.state.isFetched && <div> <br/><h1><span>🔥 🔥 </span>... Something has gone wrong ...<span>🔥 🔥 </span></h1></div>}
                 { this.state.isFetched&&!this.state.isLoaded && <div> <br/><h1>Author is Loading ...<span>🐑 ..🐑 .. 🐑 ..🐑 ..</span></h1></div>}
                </div>
               <div className = "authorList">
                <div className="grid">
                 {    this.state.isLoaded &&
                   this.state.authorList.map(function(author){
                    return(
                      <a href="" ><img src={author.avatar} alt={author.name}/></a>
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
export default Author;

import React, { Component } from "react";
import{Route, withRouter, NavLink} from 'react-router-dom';
class Author extends Component {

  constructor(props){
    super(props);
      this.state= {
          authorList: [] ,
          isLoaded: false,
          isFetched: false
        };
  }
  async componentDidMount(){

  //retrieve artwork from Artworkroute
  this.getArtworkFromServer();

  };
  async componentDidUpdate(){
     this.isAuthorloaded();
  }

  //retrieve artwork from Artworkroute
getArtworkFromServer(){

   let  urlauthorList = "http://localhost:4000/users";

      fetch(urlauthorList).then(
          results => results.json()).then(results => this.setState({'authorList': results})).catch(error => {
    console.log(`400 Retrieving Author List Error when fetching: ${error}`);
    this.setState({isFetched : false});
          return;
    });
    this.setState({isFetched:true});


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


// pass the info to the profile rendering
goToAuthorDetail(event){
   let author_id = event.target.id;
   let author_name = event.target.alt;
   localStorage.setItem("authorID", author_id);
   // localStorage.setItem("authorName", author_name);
   // this.props.history.push('/details/${img_id}');

 console.log("Go to Author Detail section: \nauthor_id: "+author_id +"\nname: "+author_name);

}


  render() {
    var that = this;
    return(
      <div>
        <hr/>
        <h1>Author List</h1>
        <hr/>

                <div id="loader">
                  { !this.state.isFetched && <div> <br/><h1><span>🔥 🔥 </span>... Something has gone wrong ...<span>🔥 🔥 </span></h1></div>}
                 { this.state.isFetched&&!this.state.isLoaded && <div> <br/><h1>Author is Loading ...<span>🐑 ..🐑 .. 🐑 ..🐑 ..</span></h1></div>}
                </div>
               <div className = "authorList">
                <div className="grid">
                 {    this.state.isLoaded &&
                   this.state.authorList.map(function(author){
                     let url = "/"+author.name+"/profile";
                    return(
                      <NavLink to={url}><img src={author.avatar} id={author._id} alt={author.name} onClick={that.goToAuthorDetail}/></NavLink>
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
export default withRouter(Author);

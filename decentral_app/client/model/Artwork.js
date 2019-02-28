const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// List of columns for Artwork schema
let Artwork = new Schema(
  {
    author: {
      type: ObjectId
    },
    //temp, for easy recognition before connecting to ethereum
    name: {
      type: String
    }
  },{
      collection: 'artworks'
  });

module.exports = mongoose.model('Artwork', Artwork);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// List of columns for Artwork schema
let Artwork = new Schema(
  {
    author_id: {
      type: ObjectId
    },
    name: {
      type: String
    },
    author: {
      type: String
    }
  },{
      collection: 'artworks'
  });

module.exports = mongoose.model('Artwork', Artwork);

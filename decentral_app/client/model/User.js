const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// List of columns for User schema
let User = new Schema(
  {
      name: {
        type: String
      },
      account: {
          type: String
      },
      bio: {
          type: String
      },
      avatar: {
        type: String
      }
    },{
      collection: 'users'
    });

module.exports = mongoose.model('User', User);

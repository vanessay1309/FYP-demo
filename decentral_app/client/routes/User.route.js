// Importing important packages
const express = require('express');

// Using express and routes
const app = express();
const userRoute = express.Router();

// User module which is required and imported
let UserModel = require('../model/User');

// To Get List Of Users
userRoute.route('/').get(function (req, res) {
  UserModel.find(function (err, User) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(User);
    }
  });
});

// To Add New User
userRoute.route('/addUser').post(function (req, res) {
  let User = new UserModel(req.body);
  User.save()
  .then(game => {
    res.status(200).json({ 'User': 'User Added Successfully' });
  })
  .catch(err => {
    res.status(400).send("Something Went Wrong");
  });
});

// To Get User Details By User ID
userRoute.route('/editUser/:id').get(function (req, res) {
  let id = req.params.id;
  UserModel.findById(id, function (err, User) {
    res.json(User);
  });
});

// To Update The User Details
userRoute.route('/updateUser/:id').post(function (req, res) {
  UserModel.findById(req.params.id, function (err, User) {
    if (!User)
      return next(new Error('Unable To Find User With This Id'));
    else {
      User.firstName = req.body.firstName;
      User.lastName = req.body.lastName;
      User.email = req.body.email;

      User.save().then(emp => {
        res.json('User Updated Successfully');
      })
      .catch(err => {
        res.status(400).send("Unable To Update User");
      });
    }
  });
});

// To Delete The User
userRoute.route('/deleteUser/:id').get(function (req, res) {
UserModel.findByIdAndRemove({ _id: req.params.id }, function (err, User) {
if (err) res.json(err);
else res.json('User Deleted Successfully');
});
});

module.exports = userRoute;

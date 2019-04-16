// Importing important packages
const express = require('express');
const Web3 = require('web3');

// Using express and routes
const app = express();
const userRoute = express.Router();

// User module which is required and imported
let UserModel = require('../model/User');

//Get web3Provider
const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

//Get contract instance
let accounts;
const componentDidMount = async function() {
  try {
    // Use web3 to get the user's accounts.
    accounts = await web3.eth.getAccounts();
  } catch (error) {
    // Catch any errors for any of the above operations.
    console.error("[web3 error]"+error);
  }
};
componentDidMount();

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

userRoute.route('/login').get(function (req, res) {
  if (accounts.length==0){
    //no account logged in
    console.log("[user login] user need to login account first");
    res.json({message:"rm"});
  }else{
    UserModel.findOne({account: accounts[0]}, function (error, User) {
      if (error) {
        console.log(error);
      }
      else {
        if (User == null){
          //require user to register
          console.log("[user login] user need to registrate for an account");
          res.json({message:"rr"});
        }else{
          res.json({message:"success", User});
        }
      }
    });
  }
});

// To Add New User
userRoute.route('/registrate').post(function (req, res) {
  //Using user default wallet address as account address
  var newUser = req.body;
  Object.assign(newUser, {account: accounts[0]});
  let User = new UserModel(newUser);

  User.save()
  .then(game => {
    console.log("[registrate user] added new user with address "+accounts[0]);
    res.json({message:"Success"});
  })
  .catch(error => {
    res.status(500).send({message: error.toString()});
  });
});

// To Get User Details By User ID
userRoute.route('/get/:id').get(function (req, res) {
  let id = req.params.id;
  UserModel.findById(id, function (error, User) {
    if (error){
      console.log("[get user] "+error);
      res.status(500).json({message: error.toString()});
    }else{
      console.log("[get user] success, return user"+id);
      res.json(User);
    }
  });
});

// To update user
userRoute.route('/update').post(function (req, res) {
  UserModel.findOneAndUpdate({ _id: req.body._id },{$set:req.body}, function (error, User) {
    if (error) {
      console.log("[update user] "+error);
      res.status(500).json({message: error.toString()});
    } else {
      console.log("[update user] success for user "+req.body._id);
      res.json({message:"Success"});
    }
  });
});


// To delete user
userRoute.route('/delete/:id').get(function (req, res) {
  UserModel.findOneAndDelete({ _id: req.params.id }, function (error, User) {
    if (error) {
      console.log("[delete user] "+error);
      res.status(500).json({message: error.toString()});
    } else {
      console.log("[delete user] deleted user "+req.params.id);
      res.json({message:"Success"});
    }
  });
});

module.exports = userRoute;

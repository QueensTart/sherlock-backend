var express = require('express');
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const {checkBody} = require("../modules/checkBody");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.post("/signup", (req, res) => {
  if(!checkBody(req.body, ["username", "password"]))
  {
    res.json({result : false, error : "Please fill in all the required fields"});
    return;
  }

  User.findOne({username : req.body.username})
  .then(data => {
    if(data === null)
    {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username : req.body.username,
        password : hash,
        token : uid2(32)
      });
      newUser.save()
      .then(newData => {
        res.json({result : true, newUser : newData});
      });
    }
    else 
    {
      res.json({result  :false, error : "User already exists in database"});
    }
  });
});

router.post("/login", (req, res) =>{
  if(!checkBody(req.body, ["username", "password"]))
  {
    res.json({result : false, error : "Please fill in all the required fields"});
    return;
  }

  User.findOne({username : req.body.username})
  .then(data => {
    if(data && bcrypt.compareSync(req.body.password, data.password)) 
    {
      res.json({result : true, connectedUser : data.username});
    }
    else
    {
      res.json({result : false, error : "Wrong username or password"});
    }
  });
});

router.delete("/deleteAccount/:username", (req, res) =>{
  User.findOne({username : req.params.username})
  .then(data => {
    if(data)
    {
      User.deleteOne({username : data.username})
      .then(newData => {
        res.json({result : true, update : newData});
      });
    }
    else
    {
      res.json({result : false, error : "Couldn't find user in database"});
    }
  });
})

module.exports = router;

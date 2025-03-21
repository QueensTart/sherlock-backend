var express = require("express");
var router = express.Router();

require("../models/connection");
const Object = require("../models/objects");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

const cloudinary = require("cloudinary").v2;
const uniqid = require("uniqid");
const fs = require("fs");

//Add new Object to Database
router.post("/addObject", (req, res) => {
  if (!checkBody(req.body, ["name", "description", "owner"])) {
    res.json({
      result: false,
      error: "Please give at least a name and a description to your object ",
    });
    return;
  }

  Object.findOne({ name: req.body.name, owner: req.body.owner }).then(
    (data) => {
      if (data === null) {
        const newObject = new Object({
          name: req.body.name,
          picture: req.body.picture,
          description: req.body.description,
          owner: req.body.owner,
          loanedTo: req.body.loanedTo,
          sharedWith: "",
        });
        newObject.save().then((newData) => {
          res.json({ result: true, newObject: newData });
        });
      } else {
        res.json({ result: false, error: "Object already exists in database" });
      }
    }
  );
});

//Find all the Objects belonging to a specified user
router.get("/findUserObject/:owner", (req, res) => {
  Object.find({ owner: req.params.owner }).then((data) => {
    if (data.length !== 0) {
      res.json({ result: true, objectList: { objects: data } });
    } else {
      res.json({
        result: false,
        error: "This user has no object in the database",
      });
    }
  });
});

//Find all the Objects shared with specified user
router.get("/findSharedObjects/:sharedWith", (req, res) => {
  Object.find({ sharedWith : req.params.sharedWith}).then(data => {
    if(data)
    {
      res.json({result : true, sharedList : data});
    }
    else
    {
      res.json({result : false, error : "This user is not in the database"});
    }
  })
});

//Find one Object belonging to a specified user
router.get("/findObject/:owner/:name", (req, res) => {
  Object.findOne({ owner: req.params.owner, name: req.params.name }).then(
    (data) => {
      if (data) {
        res.json({ result: true, object: data });
      } 
      else {
        res.json({
          result: false, error: "This object does not exist in the database",});
      }
    });
});

//Update specified Object's name, description, picture(?), loaned status
router.put("/updateObject/:owner/:_id", (req, res) => {
  Object.findOne({ owner: req.params.owner, _id: req.params._id }).then(
    (data) => {
      if (data) {
        Object.updateOne(
          { _id: data._id },
          {
            name: req.body.name,
            picture: req.body.picture,
            description: req.body.description,
            loanedTo: req.body.loanedTo,
          }
        )
        .then(() =>
        Object.findOne({owner: req.params.owner, _id: req.params._id})
          .then(newData => res.json({result : true, object : newData})));
      } 
      else {
        res.json({
          result: false,
          error: "This object is not in the database",
        });
      }
    }
  )
});

//Share specified Object with another user
router.put("/shareWith/:user", (req, res) => {
  Object.findOne({ name: req.body.name, owner: req.body.owner }).then(
    (data) => {
      if (data) {
        User.findOne({ username: req.params.user }).then((userData) => {
          if (userData) {
            Object.updateOne(
              { name: data.name },
              { sharedWith: userData.username }
            ).then((newData) => {
              res.json({ result: true, update: newData });
            });
          } else {
            res.json({
              result: false,
              error: "Couldn't find user in the database",
            });
          }
        });
      } else {
        res.json({
          result: false,
          error: "This object is not in the database",
        });
      }
    }
  );
});

//Stop sharing specified Object
router.put("/stopSharing", (req, res) => {
  if (!checkBody(req.body, ["name", "owner"])) {
    res.json({ result: false, error: "Please fill in the required fields" });
    return;
  }

  Object.findOne({ name: req.body.name, owner: req.body.owner }).then(
    (data) => {
      if (data) {
        Object.updateOne({ name: data.name }, { sharedWith: "" }).then(
          (newData) => {
            res.json({ result: true, update: newData });
          }
        );
      } else {
        res.json({
          result: false,
          error: "This object does not exist in the database",
        });
      }
    }
  );
});

//Remove specified Object from Database
router.delete("/deleteObject/:owner/:name", (req, res) => {
  Object.findOne({ owner: req.params.owner, name: req.params.name }).then(
    (data) => {
      if (data) {
        Object.deleteOne({ name: data.name }).then((newData) => {
          res.json({ result: true, update: newData });
        });
      } else {
        res.json({
          result: false,
          error: "This object does not exist in the database",
        });
      }
    }
  );
});

//Remove all of specified user's Objects from Database
router.delete("/deleteUserObjects/:owner", (req, res) => {
  Object.find({ owner: req.params.owner }).then((data) => {
    if (data) {
      Object.deleteMany({ owner: req.params.owner }).then((newData) => {
        res.json({ result: true, update: newData });
      });
    } else {
      res.json({ result: false, error: "User has no object in the database" });
    }
  });
});

//Upload an image to Cloudinary
router.post("/upload", async (req, res) => {
  const photoPath = `/tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
    fs.unlinkSync(photoPath);
  } else {
    res.json({ result: false, error: resultMove });
  }
});

module.exports = router;

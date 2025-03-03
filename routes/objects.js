var express = require('express');
var router = express.Router();

require("../models/connection");
const Object = require("../models/objects");
const User = require("../models/users");
const {checkBody} = require("../modules/checkBody");

//Add new Object to Database
router.post("/addObject", (req, res) => {
    if(!checkBody(req.body, ["name", "description", "owner"]))
    {
        res.json({result : false, error : "Please give at least a name and a description to your object "});
        return;
    }

    Object.findOne({name : req.body.name, owner : req.body.owner})
    .then(data => {
        if(data === null)
        {
            const newObject = new Object({
                name : req.body.name,
                picture : req.body.picture,
                description : req.body.description,
                owner : req.body.owner,
                loanedTo : req.body.loanedTo,
                sharedWith : ""
            });
            newObject.save()
            .then(newData => {
                res.json({result : true, newObject : newData})
            });
        }
        else
        {
            res.json({result  :false, error : "Object already exists in database"});
        }
    })
});

//Find all the Objects belonging to a specified user
router.get("/findUserObject/:owner", (req, res) => {
    Object.find({owner : req.params.owner})
    .then(data => {
        if(data)
        {
            res.json({result : true, objectList : data});
        }
        else
        {
            res.json({result : false, error : "This user has no object in the database"});
        }
    })
});

//Update specified Object's name, description, picture(?), loaned status
router.put("/updateObject/:owner/:name", (req, res) => {
    Object.findOne({owner : req.params.owner, name : req.params.name})
    .then(data => {
        if(data)
        {
            Object.updateOne({name : data.name}, 
            {
            name : req.body.name,
            picture : req.body.picture,
            description : req.body.description,
            loanedTo : req.body.loanedTo,
            }) 
            .then(data => {
                res.json({result : true, update : data})
            });
        }
        else
        {
            res.json({result : false, error : "This object is not in the database"});  
        }
    });
});

//Share specified Object with another user
router.put("/shareWith/:user", (req, res) => {
    Object.findOne({name : req.body.name, owner : req.body.owner})
    .then(data => {
        if(data)
        {
            User.findOne({username : req.params.user})
            .then(userData => {
                if(userData)
                {
                    Object.updateOne({name : data.name}, {sharedWith : userData.username})
                    .then(newData => {
                        res.json({result : true, update : newData});
                    });
                }
                else
                {
                    res.json({result : false, error : "Couldn't find user in the database"});  
                }
            })
        }
        else
        {
            res.json({result : false, error : "This object is not in the database"});
        }
    });
});

//Stop sharing specified Object
router.put("/stopSharing", (req,res) => {
    if(!checkBody(req.body, ["name", "owner"]))
    {
        res.json({result : false, error : "Please fill in the required fields"});
        return;
    }

    Object.findOne({name : req.body.name, owner : req.body.owner})
    .then(data => {
        if(data)
        {
            Object.updateOne({name : data.name}, {sharedWith : ""})
            .then(newData => {
                res.json({result : true, update : newData});
            });
        }
        else
        {
            res.json({result : false, error : "This object does not exist in the database"});
        }
    });
});

//Remove specified Object from Database
router.delete("/deleteObject/:owner/:name", (req, res) => {
    Object.findOne({owner : req.params.owner, name : req.params.name})
    .then(data => {
        if(data)
        {
            Object.deleteOne({name : data.name})
            .then(newData => {
                res.json({result : true, update : newData});
            });
        }
        else
        {
            res.json({result : false, error : "This object does not exist in the database"});
        }
    });
});

//Remove all of specified user's Objects from Database
router.delete("/deleteUserObjects/:owner", (req, res) => {
    Object.find({owner : req.params.owner})
    .then(data => {
        if(data)
        {
            Object.deleteMany({owner : req.params.owner})
            .then(newData => {
                res.json({result : true, update : newData});
            })
        }
        else
        {
            res.json({result : false, error : "User has no object in the database"});
        }
    });
});


module.exports = router;
var express = require('express');
var router = express.Router();

require("../models/connection");
const Object = require("../models/objects");
const {checkBody} = require("../modules/checkBody");

router.post("/addObject", (req, res) => {
    if(!checkBody(req.body, ["name", "description"]))
    {
        res.json({result : false, error : "Please give at least a name and a description to your object "});
        return;
    }

    Object.findOne({name : req.body.name})
    .then(data => {
        if(data === null)
        {
            const newObject = new Object({
                name : req.body.name,
                picture : req.body.picture,
                description : req.body.description,
                loanedTo : req.body.loanedTo,
                owner : req.body.owner
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


module.exports = router;
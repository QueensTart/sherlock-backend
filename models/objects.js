const mongoose = require("mongoose");

const objectsSchema = mongoose.Schema({
    name : String,
    picture : String,
    description : String,
    owner : {type : mongoose.Schema.Types.ObjectId, ref : "users"},
    loanedTo : String,
    sharedWith : String
});

const Object = mongoose.model("objects", objectsSchema);

module.exports = Object;
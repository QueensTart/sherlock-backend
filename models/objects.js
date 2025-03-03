const mongoose = require("mongoose");

const objectsSchema = mongoose.Schema({
    name : String,
    picture : String,
    description : String,
    loanedTo : String,
    owner : [{type : mongoose.Schema.Types.ObjectId, ref : "users"}]
});

const Object = mongoose.model("objects", objectsSchema);

module.exports = Object;
const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
    username : String,
    password : String,
    token : String
})
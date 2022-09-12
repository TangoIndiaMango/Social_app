const mongoose = require('mongoose');
const User = require("../models/Comments");


const PostSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max: 500
    }, 
    img:{
        type: String,
    },
    likes:{
        type:Array,
        defaults: [],
    },

},{timestamps:true}
)

module.exports = mongoose.model("Post", PostSchema);
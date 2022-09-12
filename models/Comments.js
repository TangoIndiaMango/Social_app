const mongoose = require('mongoose');
const Post = require("../models/Post");
const User = require("../models/User");

const CommentSchema = mongoose.Schema({

    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    post_id: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    comment: String,


}, {timestamp:true} )

module.exports = mongoose.model("Comment", CommentSchema);



// comment:{
//     post_id: {type: mongoose.Schema.Types.ObjectId, ref: Post},
//     post_id: {type: mongoose.Schema.Types.ObjectId, ref: User},
// },
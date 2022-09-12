const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required: true,
        min:3,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        min:6,
    },
    profilePicture:{
        type:String,
        default: "",
    },
    coverPicture:{
        type:String,
        default: "",
    },
    followers: {
        type:Array,
        default: [],
    },
    followings:{
        type:Array,
        default: [],
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    desc:{
        type:String,
        max: 50,
    },
    city:{
        type:String,
        max: 50
    },
    from:{
        type:String,
        max: 50,
    },
    relationship:{
        type: Number,
        enum: [1, 2, 3]
    },
    token: {
        type: String,
    }
},
{ timestamps:true }   //create or update automatically work on the time
);

module.exports = mongoose.model("User", UserSchema);
const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comments");
const auth = require("../middleware/auth");

router.post("/:id/create", auth, async (req, res) => {
    const newComment = new Comment(req.body);
    try {
        const saveComment = await newComment.save();
        res.status(201).json({
            status: "success",
            data: saveComment,
        })

        
    } catch (error) {
        return res.status(404).json({
            message: "Check your code"
        })
    }


})


module.exports = router;
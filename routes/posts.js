const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");

//CREATE a post

router.post("/", auth, async (req, res) => {
    const newPost = new Post(req.body)
    try{
        const savePost = await newPost.save();
        res.status(200).json({
            status: "success",
            data: savePost
        });
    }catch(err){
        res.status(500).json({
            err
        })
    }
})

//UPDATE

router.put("/update/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body})
            return res.status(200).json({
                status: "success",
                message: "Post successfully updated ",})
        }else{
            return res.status(403).json({
                status: "failed",
                message: "Can't update User Post, Please try agian..."
            })
        }
        
        
    } catch (error) {
        return res.status(500).json({
            error
        })
    }

});

//delete

router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            return res.status(200).json({ message: "post have been deleted" })
        } else{
            return res.status(404).json({
                message:"can't delete post."
            })
        }
    } catch (error) {
        return res.status(500).json(error)       
    }
});

//LIKE or remove like

router.put("/:id/like", async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes:req.body.userId} });
            res.status(200).json("The post has been liked")
        } else{
            await post.updateOne({ $pull: {likes:req.body.userId } });
            res.status(200).json("Remove like")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//get a post

router.get("/:id", auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})

//get timeline posts

router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).json("you are crashing")
    }
})

module.exports = router;

//get all users posts

router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({username:req.params.username})
        const posts = await Post.find({  userId: user._id});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json("you are crashing")
    }
})


module.exports = router;